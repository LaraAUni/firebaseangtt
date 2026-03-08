import { Component } from '@angular/core';
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
  createUserWithEmailAndPassword
} from "firebase/auth";



@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class  LoginPage {
  fireInit = inject(FireInit);
  auth = getAuth(this.fireInit.app);
  email :string;
  password :string;
  info=false;
  provider = new GoogleAuthProvider();
  inpopen=false;
  subopen=false;
  
  constructor(){
    this.email='';
    this.password=''
}
  
ngOnInit(){

  const form = document.getElementById('signForm') as HTMLFormElement;
// Add submit event listener
  form.addEventListener('submit', async (event) => {

  // Prevent default form submission (page reload)
  event.preventDefault();

  // Rest of the logic (collect data, updatewiew)
  const formData = new FormData(form);

let inp;
inp=formData.get('email');
if(inp)this.email=inp.toString();
inp=formData.get('password');
if(inp)this.password=inp.toString();

if(this.inpopen)this.signIn();
else if(this.subopen)this.signUp();
});
}

  signUp(auth=this.auth, email=this.email, password=this.password): void {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
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
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
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
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  getUser():void{
    const auth = this.auth;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
  }
}
