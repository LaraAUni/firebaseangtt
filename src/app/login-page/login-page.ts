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
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { UserData, UserConverter } from '../services/userdata';
import { doc, setDoc, getDoc, DocumentSnapshot, waitForPendingWrites } from "firebase/firestore";
import { IconsNames } from '../services/icons-names';

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
  id: string = '';
  email: string;
  password: string;
  provider = new GoogleAuthProvider();
  signedIn = false;
  inpopen = false;
  subopen = false;
  optionsOp = false;
  userName: string | null = 'Guest';
  mapOp = false;
  newGame= false;
  uid = '';
  user = new UserData();

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
        this.uid = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        this.id = user.uid;
        await this.getData();
        if (this.rules.DMIds.includes(user.uid)) {
          this.rules.isDM = true;
        }
       
        // ...
      } else {
        // User is signed out
        this.signedIn = false;
        this.userName = 'Guest';
        // ...
      }
      this.getGame();
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
        this.user.games.push(this.rules.gameID);
        this.user.gamenames.push(inp.toString());
        this.addData(this.uid);
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
        const user = userCredential.user;
        // ...
        this.ref.markForCheck(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  signOut(auth = this.auth): void {
    auth.signOut().then(() => {
      this.optionsOp = false;
      this.ref.markForCheck();
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
        this.uid = user.uid;
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

  getUser(): any {
    const auth = this.auth;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.uid = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        // ...
        return user;
      } else {
        // User is signed out
        // ...
        this.signedIn = false;
        this.userName = 'Guest';
        return null;
      }
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

  async getGame(id: number=this.rules.gameID){
    this.rules.getRules(id).then((e)=>{
      this.iconsNames.makeList(true);
      this.iconsNames.makeList(false);
    })
  }

  async getData(id: string=this.uid): Promise<void> {
    const dataRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter());
    const snapshot1: DocumentSnapshot<UserData> = await getDoc(dataRef);
    const uData: UserData = snapshot1.data()!;
    if (uData) {
      this.user = uData;
    }
  }
  async addData(id: string=this.uid): Promise<void> {
    const userRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter()); //(this.gameID*200) ?? ma non vaaaa
    await setDoc(userRef, this.user);
  }

}
