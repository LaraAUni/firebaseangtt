import { ChangeDetectorRef, Component } from '@angular/core';
import { inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { AngularFireAuth } from "@angular/fire/compat/auth";
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



@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  fireInit = inject(FireInit);
  auth = getAuth(this.fireInit.app);
  email :string;
  password :string;
  info=false;
  provider = new GoogleAuthProvider();
  signedIn=false;
  inpopen=false;
  subopen=false;
  optionsOp=false;
  userName:string | null = 'Guest';
  
  constructor(private ref: ChangeDetectorRef){
    this.email='';
    this.password=''
}
  
ngOnInit(){

  this.checkAuthState();
  const form = document.getElementById('signForm') as HTMLFormElement; //non legge il form
  const options = document.getElementById('optionsForm') as HTMLFormElement;
// Add submit event listener
  onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        // ...
      }else {
        // User is signed out
        this.signedIn = false;
        this.userName = 'Guest';
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
inp=formData.get('email'); //funzionava ma ora no?? qualcosa con option
if(inp)this.email=inp.toString();
inp=formData.get('password');
if(inp)this.password=inp.toString();
if(this.inpopen)this.signIn();
else if(this.subopen)this.signUp();
});

options.addEventListener('submit', async (event) => {
  event.preventDefault();
const optionData = new FormData(options);
let inp;
inp=optionData.get('newName');
if(inp){this.userName=inp.toString();
  this.updateName(this.userName);
}
});
}

  signUp(auth=this.auth, email=this.email, password=this.password): void {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        this.subopen=false;
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
  
  signIn(auth=this.auth, email=this.email, password=this.password): void {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        this.inpopen=false;
        const user = userCredential.user;
        // ...
        this.ref.markForCheck(); // Aggiorna la vista dopo il cambiamento dello stato di autenticazione
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  signOut(auth=this.auth): void {
    auth.signOut().then(() => {
      this.optionsOp=false;
      this.ref.markForCheck();
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  
  checkAuthState(auth=this.auth): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        this.signedIn = true;
        this.userName = user.displayName || user.email || 'Username';
        // ...
      }else {
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
    const uid = user.uid;
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
  
  updateName(name:string): void {
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
}
