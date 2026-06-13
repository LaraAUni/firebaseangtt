import { ChangeDetectorRef, Component } from '@angular/core';
import { inject, Inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Sharedrules } from '../services/sharedrules'
import {
  EmailAuthCredential,
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
import { doc, setDoc, getDoc, DocumentSnapshot, waitForPendingWrites } from "firebase/firestore";
import { IconsNames } from '../services/icons-names';
import { Userinfo } from '../services/userinfo';
import { App } from '../app';
import { Notifs } from '../services/notifs';
import {NgStyle} from '@angular/common';


@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
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

  constructor(private ref: ChangeDetectorRef) {
    this.email = '';
    this.password = ''
  }

  ngOnInit() {
    this.checkAuthState();
    const form = document.getElementById('signForm') as HTMLFormElement; //non legge il form
    const options = document.getElementById('optionsForm') as HTMLFormElement;
    const map = document.getElementById('MapOp') as HTMLFormElement;
    // Add submit event listener
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.info.id = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        await this.info.getUser().then((e)=>{
        if(this.info.info.games[0])this.getGame(this.info.info.games[0].id);
        });
        // ...
      } else {
        // User is signed out
        this.signedIn = false;
        this.userName = 'Guest?';
        this.getGame(0); //da mettere un link 
        this.info=new Userinfo;
        // ...
      }
      this.ref.detectChanges(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
    });

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
      if(inp){
        this.newGame=false;
        await this.rules.newGame(inp.toString());
        this.info.info.games.push({id: this.rules.gameID, name: inp.toString()});
        this.info.addUser(this.info.id);
        //customUserclaims?
      }
    })
  }

  signUp(auth = this.auth, email = this.email, password = this.password): void {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        this.subopen = false;
        const user = userCredential.user;
        this.ref.markForCheck();
        // ...
      })
      .catch((error) => {
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
        this.getGame(0); //da usare il link
        this.info.id='Guest';
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
      this.ref.markForCheck();
      this.info=new Userinfo;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  checkAuthState(auth = this.auth): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.info.id = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        // ...
      } else {
        // User is signed out
        this.signedIn = false;
        this.userName = 'Guest';
        // ...
      }
      this.ref.detectChanges(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
    });
  }


  updateName(name: string): void {
    const auth = this.auth;
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        displayName: name
      }).then(() => {
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

  async getGame(id: number){
    this.rules.getRules(id).then((e)=>{
      this.iconsNames.makeList(true);
      this.iconsNames.makeList(false);
      this.notifs.getMessage(id);
      this.depsList=[this.rules.depsList.includes(1), this.rules.depsList.includes(2),
        this.rules.depsList.includes(3), this.rules.depsList.includes(4),
        this.rules.depsList.includes(5), this.rules.depsList.includes(6),
        this.rules.depsList.includes(7), this.rules.depsList.includes(8),
        this.rules.depsList.includes(9), this.rules.depsList.includes(10),
        this.rules.depsList.includes(11), this.rules.depsList.includes(12),
        this.rules.depsList.includes(13), this.rules.depsList.includes(14),
        this.rules.depsList.includes(15), this.rules.depsList.includes(16)];
    })
  }

  searchUser(name: string){
    
  }
  
}
