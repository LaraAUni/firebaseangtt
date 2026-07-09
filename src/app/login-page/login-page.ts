import { ChangeDetectorRef, Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { Sharedrules } from '../services/sharedrules'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { UserConverter, UserData } from '../services/userdata';
import { collection, query, where, getDocs } from "firebase/firestore";
import { IconsNames } from '../services/icons-names';
import { Userinfo } from '../services/userinfo';
import { Notifs } from '../services/notifs';
import { FormsModule, NgForm } from '@angular/forms';
import { GameService } from '../services/game-service';
import { DocumentSnapshot, doc, getDoc } from 'firebase/firestore';
import { Iconsclass } from '../iconsclass';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
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
  gameServ=inject(GameService);
  notifs=inject(Notifs);
  provider = new GoogleAuthProvider();
  signedIn = false;
  inpopen = false;
  subopen = false;
  optionsOp = false;
  deleting=false;
  mapOp = false;
  userOp=false;
  newGame= false; //funzione?
  depsList= Array(16).fill(false);
  maxDeps=false;
  searching='';
  playerSearch: [string,string][]=[]; //unire a playerSearch?
  invitedList: boolean[]=[]; //cambiare a Boolean mappata a Ind
  newNameValue='';
  
  // NgZone serve per rientrare nella zona di Angular dopo le callback di Firebase,
  // che girano fuori zona — senza questo il menu non si aggiorna
  ngZone = inject(NgZone);

  constructor(private ref: ChangeDetectorRef) {
  }

ngOnInit() {
  this.checkAuthState();
}

onSignFormSubmit(f: NgForm) {
  if (this.inpopen) this.signIn(f.value.email, f.value.password);
  else if (this.subopen) this.signUp(f.value.email, f.value.password);
}

async onMapFormSubmit(newGameName: NgForm) {
  let gameName=newGameName.value.newGameName;
  if (!this.newGame || !gameName) return;
  this.newGame = false;
  const time = new Date();
  const date = Number(
    '' + time.getDay() + time.getMonth() + time.getFullYear()
    + time.getHours() + time.getMinutes() + time.getSeconds()
  );
  await this.rules.newGame(gameName, date);
  this.info.games = [...this.info.games, { date, name: gameName }];
  await this.info.addUser(this.info.uid);
  this.ref.markForCheck();
}

onUpdateNameSubmit(newName: string) {
  if (newName) this.updateName(newName);
}

onSearchSubmit(code: string) {
  if (code.length > 0) this.searchUser(code);
}

  async signUp(email: string, password: string, auth = this.auth): Promise<void> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    this.subopen = false;
    const user = credential.user;
    this.info.name = user.email || 'Username';
    this.info.uid=user.uid;
    // cerca un codice non ancora usato
    let taken = true;
    while (taken) {
      const code = (this.info.name?.slice(0,3)||'Abc')+this.generateRandomString(5);
      const q = query(
        collection(this.fireInit.db, 'userdata'),
        where('code', '==', code)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        this.info.code = code;
        taken = false;
      }
    }
    await this.info.addUser(user.uid);
    this.ref.markForCheck();
  } catch (error) {
    console.error('Errore registrazione:', error);
  }
}

  signIn(email: string, password: string, auth = this.auth): void {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
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
  signInAnonymously(auth).then(() => {
        this.inpopen = false;
        this.signedIn = true;
        this.getGame(0, 'NoGame'); //da usare il link
        this.info.code='Guest';
        this.info.name='Guest';
        this.info.uid='Guest'
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
      this.info.getUser('');
      this.ref.markForCheck();
      this.playerSearch=[];
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  async checkAuthState(auth = this.auth): Promise<void> {
    onAuthStateChanged(auth, (user) => this.ngZone.run(async () => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.signedIn = true;
        const userName = user.displayName || user.email || 'NewUser';
        try{
        await this.info.getUser(user.uid)
        if(userName!=this.info.name){
        this.info.name=userName;
        this.info.addUser(user.uid);}
          if(!this.info.code){
          let done=false;
          do{ done=false;
          this.info.code=(this.info.name?.slice(0,3)||'Abc')+this.generateRandomString(5);
          const q = query(collection(this.fireInit.db, 'userdata'), where("code", "==", this.info.code.toLowerCase()));
          try{
            let querySnapshot= await getDocs(q);
            querySnapshot.forEach((doc) => {
            if(this.info.code=doc.data()['code'])done=true;
          });
          }catch(err){console.log(err)};
          }while(done);
          this.info.addUser(user.uid);
          }
        let name=window.document.location.href;
        let [game, date]=name?.split('/game/')[1]?.split('-')??[];
        if(game && date){ 
          await this.getGame(Number(date), game);
        }
        else {await this.getGame(0, 'NoGame');
        }
        }catch(err){console.log(err);};
        // ...
      } else {
        // User is signed out
        this.signedIn = false;
        this.info.name = 'Guest';
        let name=window.history.state;
        let [game, date]=name?.url?.split('/game/')[1]?.split('-')??['',''];
        if(name && date) await this.getGame(Number(date), game);
        else {await this.getGame(0, 'NoGame');}
        this.info.getUser('');
        // ...
      }
      this.ref.detectChanges(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
    }));
  }

  copyFriendCode(){
    navigator.clipboard.writeText(this.info.code);
  }

  updateName(name: string): void {
    const auth = this.auth;
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        displayName: name
      }).then(() => {
        this.info.name = name ?? '';
        this.info.addUser(user.uid);
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

  async updateDeps(n: number){
    if(!this.rules.isDM) return;
      let ind=this.rules.depsList.indexOf(n);
    if(this.depsList[n-1]){ // questa è depList locale per i checkmark che è true se è da togliere, false se da aggiungere
      for(const elem of this.iconsNames.ordCharaList['dep'+ind as keyof Iconsclass]){
      let id=elem.id;
      try{
        await this.iconsNames.toReserve(id, ind, false);
      }catch(err){console.log(err)}
      }
      this.iconsNames.addList(false);
      this.rules.depsList=this.rules.depsList.filter(c=>c!=n);
      this.depsList[n-1]=false;
    }
    else{this.rules.depsList=[...this.rules.depsList, n];
      this.depsList[n-1]=true;
      if(n>10) this.rules.bonusDeps=[...this.rules.bonusDeps, 'Custom'];
    }
    this.maxDeps=(this.rules.depsList.length>=6);
    this.rules.addRules();
  }

  async getGame(date: number, name: string): Promise<void> {
    if(date==0) {
        this.depsList= Array(16).fill(false);
        this.invitedList=this.info.friends.length>0?Array(this.info.friends.length).fill(false):[];
        this.ref.markForCheck();
        const href = window.document.location.href;
        if (href.includes('/game/')) {
          const [base] = href.split('/game/');
          window.location.replace(base);
        }
        return;
    }
    try{
      let success=await this.rules.getRules(date, name);
      if(!success){
        this.getGame(0, 'NoGame');
        return;
      }
      this.iconsNames.getList(true);
      this.iconsNames.getList(false);
      this.notifs.getMessage(date);
      this.maxDeps=(this.rules.depsList.length>=6);
      const sortedList = this.rules.depsList.sort((a, b) => a - b);
      this.depsList= Array(16).fill(false);
      for(let i=0; i<sortedList.length; i++){
        this.depsList[sortedList[i]-1]=true;
      }
      if(!this.rules.isDM)this.invitedList=this.info.friends.length>0?Array(this.info.friends.length).fill(false):[];
      else this.invitedList=this.info.friends.map(f => this.rules.playerIDs.includes(f.id));
    window.history.pushState({}, '', '/game/' + name + '-' + date);
    this.ref.markForCheck();
    }catch(err){console.log(err);}
  }

  async deleteGame(date:number, name:string){
    this.deleting = false; //esco dalla modalità elimina per evitare eliminazioni accidentali
    try{
    await this.gameServ.deleteGame(name, date);
    this.ref.markForCheck();
    if(name==this.rules.name && date==this.rules.gameID){
      window.history.back();
      let name=window.history.state;
        let [game, date]=name?.url?.split('/game/')[1]?.split('-')??[];
        if(game && date) await this.getGame(Number(date), game);
        else {await this.getGame(0, 'NoGame');}
    }
    }catch(err){console.log(err);}
  }

  async searchUser(find: string){
    if(find.length==0||find==this.info.code) return;
    this.playerSearch=[];
    const q = query(collection(this.fireInit.db, 'userdata'), where("code", "==", find));
    const n = query(collection(this.fireInit.db, 'userdata'), where("name", "==", find));
    try{
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if(!this.info.friends.some(f => f.id === doc.id)){
      this.playerSearch=[...this.playerSearch, [doc.data()['name'], doc.id]];
    }
    });
    }catch(err){console.log(err);}
    if(this.playerSearch.length==0){
      try{
      let querySnapshot = await getDocs(n);
      querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      if(doc.id!=this.info.uid && !this.info.friends.some(f => f.id === doc.id)){
        this.playerSearch=[...this.playerSearch, [doc.data()['name'], doc.id]];
      }
      });
      }catch(err){console.log(err);}
    }
    this.searching='';
    this.ref.markForCheck();
  }

  async addFriend(ind :number){
    const id=this.playerSearch[ind][1];
    this.info.friends=[...this.info.friends, {name: this.playerSearch[ind][0], id}];
    try{
    await this.info.addUser(this.info.uid);
    this.playerSearch=[];
    this.ref.markForCheck();
    }catch(err){console.log(err);}
    try{
    let friend= await this.info.getUserData(id);
    friend.friends=[...friend.friends, {name: this.info.name, id: this.info.uid}];
    await this.info.addUser(id, friend);
    }catch(err){console.log(err);}
  }

  async removeFriend(ind: number){
    const friendId=this.info.friends[ind].id;
    try{
    this.info.friends=this.info.friends.filter(c=>c.id!=friendId);
    await this.info.addUser();
    this.ref.markForCheck();
    }catch(err){console.log(err);}
    try{
    let friend= await this.info.getUserData(friendId);
    if(friend.name=='NewUser') {console.log('Friend not found'); return;}
    friend.friends=friend.friends.filter(c=>c.id!=this.info.uid);
    await this.info.addUser(friendId, friend);
    }catch(err){console.log(err);}
  }

  async inviteFriend(ind: number){
    if(!this.rules.isDM) return;
    let  uInfo= await this.info.getUserData(this.info.friends[ind].id);
    if(uInfo.games.some(g=>g.date==this.rules.gameID && g.name==this.rules.name))return;
    uInfo.games=[...uInfo.games, {date: this.rules.gameID, name: this.rules.name}];
    try{
    await this.info.addUser(this.info.friends[ind].id, uInfo);
    this.rules.playerIDs=[...this.rules.playerIDs, this.info.friends[ind].id];
    await this.rules.addRules();
    this.invitedList=[...this.invitedList, true];
    this.ref.markForCheck();
    }catch(err){console.log(err);}
  }

  async unInvite(ind: number){
    if(!this.rules.isDM) return;
    let  uInfo= await this.info.getUserData(this.info.friends[ind].id);
    if(!uInfo.games.some(g=>g.date==this.rules.gameID && g.name==this.rules.name))return;
    uInfo.games=uInfo.games.filter(g=>!(g.date==this.rules.gameID && g.name==this.rules.name));
    await this.info.addUser(this.info.friends[ind].id, uInfo);
    this.rules.playerIDs=this.rules.playerIDs.filter(id=>id!=this.info.friends[ind].id);
    await this.rules.addRules();
    this.invitedList=this.invitedList.filter((v, i) => i !== ind);
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
