
import { ChangeDetectorRef, Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { inject, Inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { Sharedrules } from '../services/sharedrules'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { UserData, UserConverter } from '../services/userdata';
import { collection, query, where, getDocs } from "firebase/firestore";
import { IconsNames } from '../services/icons-names';
import { Userinfo } from '../services/userinfo';
import { App } from '../app';
import { Notifs } from '../services/notifs';


@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './login-page.css',
})
export class LoginPage {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  auth = getAuth(this.fireInit.app);
  iconsNames=inject(IconsNames);
  info=inject(Userinfo)
  app=inject(App);
  notifs=inject(Notifs);
  email: string;
  password: string;
  provider = new GoogleAuthProvider();
  signedIn = false;
  inpopen = false;
  subopen = false;
  optionsOp = false;
  deleting=false;
  userName: string | null = 'Guest';
  mapOp = false;
  userOp=false;
  newGame= false; //funzione?
  depsList= Array(16).fill(false);
  playerSearch: string='';
  friendsList: {name: string, code: string}[]=[];

  // NgZone serve per rientrare nella zona di Angular dopo le callback di Firebase,
  // che girano fuori zona — senza questo il menu non si aggiorna
  ngZone = inject(NgZone);

  constructor(private ref: ChangeDetectorRef) {
    this.email = '';
    this.password = ''
  }

  ngOnInit() {
    this.checkAuthState();
    const form = document.getElementById('signForm') as HTMLFormElement; //non legge il form
    const options = document.getElementById('optionsForm') as HTMLFormElement;
    const map = document.getElementById('MapOp') as HTMLFormElement;
    const search = document.getElementById('playerSearch') as HTMLFormElement;

    
        let name=window.document.location.href; //non va???
        let [game, date]=name?.split('/game/')[1]?.split('-')??[];
        if(game && date)this.getGame(Number(date), game);
        
    form.addEventListener('submit', async (event) => {

      // Prevent default form submission (page reload)
      event.preventDefault();

      // Rest of the logic (collect data, updatewiew)
      const formData = new FormData(form);
      let inp;
      inp = formData.get('email'); //funzionava ma ora no?? qualcosa con option
      if (inp) this.email = inp.toString();
      inp = formData.get('password');
      if (inp) this.password = inp.toString();
      if (this.inpopen) this.signIn();
      else if (this.subopen) this.signUp();
    });
    
    options.addEventListener('submit', async (event) => {
      event.preventDefault();
      const optionData = new FormData(options);
      let inp;
      inp = optionData.get('newName');
      if (inp) {
        this.userName = inp.toString();
        this.updateName(this.userName);
      }
    });

    map.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nameData = new FormData(map);
      let inp;
      inp = nameData.get('newGameName');
      if(this.newGame){if(inp){
        this.newGame=false;
        let time=new Date;
        let date=Number('' + time.getDay() + time.getMonth() + time.getFullYear() + time.getHours() + time.getMinutes() + time.getSeconds());
        this.rules.newGame(inp.toString(), date).then(()=>{
        this.info.info.games=[...this.info.info.games, {date: date, name: inp.toString()}];
        this.info.addUser(this.info.id);
        this.ref.markForCheck();});
        //customUserclaims?
      }}
      
    })

      search.addEventListener('submit', async (event) => {
        event.preventDefault();
        const find= new FormData(search).get('search')?.toString()??'';
        if(find.length>0){
          this.searchUser(find);
        }
      });
  }

  signUp(auth = this.auth, email = this.email, password = this.password): void {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        this.subopen = false;
        const user = userCredential.user;
        this.userName = user.displayName || user.email || 'Username';
        this.info.id = user.uid;
        this.info.info.name=this.userName;
        let empty=true;
        do{this.info.info.code=this.generateRandomString();
          const q = query(collection(this.fireInit.db, 'userdata'), where("code", "==", this.info.info.code));    
          getDocs(q).then((querySnapshot) => {
          empty=querySnapshot.empty}).catch((err)=>{console.log(err)});
        }while(!empty); //se ho trovato un codice uguale lo rifaccio
        this.info.addUser(this.info.id);
        this.ref.markForCheck();
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  signIn(auth = this.auth, email = this.email, password = this.password): void {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.inpopen = false;
        // ...
        this.ref.markForCheck(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  
  SignInAnonymously(auth = this.auth): void {
  signInAnonymously(auth)
  .then(() => {
        this.inpopen = false;
        this.signedIn = true;
        this.userName = 'Guest';
        this.getGame(0, 'NoGame'); //da usare il link
        this.info.id='Guest';
        this.info.info.name='guest';
        this.rules.isDM=false;
        // ...
        this.ref.markForCheck();
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
  }
  signOut(auth = this.auth): void {
    auth.signOut().then(() => {
      this.optionsOp = false;
      this.info.info = new UserData();
      this.info.id = '';
      this.ref.markForCheck();
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  checkAuthState(auth = this.auth): void {
    onAuthStateChanged(auth, (user) => this.ngZone.run(async () => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.info.id = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'NewUser';
        this.info.getUser().then(async (e)=>{
          if(this.userName && this.userName!=this.info.info.name){ {
          this.info.info.name=this.userName;
          this.info.addUser(this.info.id);
        let name=window.document.location.href; //non va???
        let [game, date]=name?.split('/game/')[1]?.split('-')??[];
        console.log('Codice Partita:', game, date);
        if(game && date) await this.getGame(Number(date), game);
        else {await this.getGame(0, 'NoGame');}
        }
        }});
        // ...
      } else {
        // User is signed out
        this.signedIn = false;
        this.userName = 'Guest';
        let name=window.history.state;
        let [game, date]=name?.url?.split('/game/')[1]?.split('-')??['',''];
        console.log('Codice Partita:', name, date);
        if(name && date) await this.getGame(Number(date), game);
        else {await this.getGame(0, 'NoGame');}
        this.info.info = new UserData();
        this.info.id = '';
        // ...
      }
      this.ref.detectChanges(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
    }));
  }


  updateName(name: string): void {
    const auth = this.auth;
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        displayName: name
      }).then(() => {
        this.userName = name;
        this.info.info.name = this.userName ?? '';
        this.info.addUser(this.info.id);
        this.ref.markForCheck();
        // Update successful
      }).catch((error) => {
        // An error occurred
        // ...
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }
  }

  updateDeps(n: number){
    if(!this.rules.isDM) return;
      let ind=this.rules.depsList.indexOf(n);
    if(this.depsList[n-1]){
      for(let i=0; i<this.iconsNames.ordCharaList[ind].length; i++){
      let id=this.iconsNames.ordCharaList[ind][i].id;
      this.iconsNames.toReserve(id, ind);}
      this.rules.depsList=this.rules.depsList.filter(c=>c!=n);
      this.depsList[n-1]=false;
    }
    else{this.rules.depsList=[...this.rules.depsList, n];
      this.depsList[n-1]=true;
      if(n>10) this.rules.bonusDeps=[...this.rules.bonusDeps, 'Custom'];
    }
    this.rules.addRules();
  }

  async getGame(date: number, name: string): Promise<void> {
    if(date==0) {
        this.depsList= Array(16).fill(false);
        this.ref.markForCheck();
        const href = window.document.location.href;
        if (href.includes('/game/')) {
          const [base] = href.split('/game/');
          window.location.replace(base);
        }
        return;
    }
    this.rules.getRules(date, name).then((e)=>{
      if(!e){
        this.getGame(0, 'NoGame');
        return;
      }
    
      this.iconsNames.makeList(true);
      this.iconsNames.makeList(false);
      this.notifs.getMessage(date);
      this.depsList=[this.rules.depsList.includes(1), this.rules.depsList.includes(2),
        this.rules.depsList.includes(3), this.rules.depsList.includes(4),
        this.rules.depsList.includes(5), this.rules.depsList.includes(6),
        this.rules.depsList.includes(7), this.rules.depsList.includes(8),
        this.rules.depsList.includes(9), this.rules.depsList.includes(10),
        this.rules.depsList.includes(11), this.rules.depsList.includes(12),
        this.rules.depsList.includes(13), this.rules.depsList.includes(14),
        this.rules.depsList.includes(15), this.rules.depsList.includes(16)];
    window.history.pushState({}, '', '/game/' + name + '-' + date);
    this.ref.markForCheck();
    });
  }

  async deleteGame(date:number, name:string){
    await this.app.deleteGame(name, date).then(async ()=>{
    this.deleting = false; // dopo la cancellazione esco dalla modalità elimina
    this.ref.markForCheck();
    if(name==this.rules.name && date==this.rules.gameID){
      window.history.back();
      let name=window.history.state;
        let [game, date]=name?.url?.split('/game/')[1]?.split('-')??[];
        if(game && date) await this.getGame(Number(date), game);
        else {await this.getGame(0, 'NoGame');}
    }
    }).catch((err)=>{console.log(err)});
  }

  async searchUser(code: string){
    if(code.length==0||code==this.info.info.code) return;
    console.log('Searching...', code);
    const q = query(collection(this.fireInit.db, 'userdata'), where("code", "==", code));
    getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    this.playerSearch=doc.data()['name'];
    });}).catch((err)=>{console.log(err)});
    this.ref.markForCheck();
  }

  generateRandomString(len: number=8): string {
  const charas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charas.length);
    res += charas.charAt(randomIndex);
  }
  return res;
}

}
