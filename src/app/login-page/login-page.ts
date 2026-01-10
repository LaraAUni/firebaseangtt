import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider, signInWithPopup, signOut, user, Auth } from  '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class  LoginPage {
        private  auth: Auth = inject(Auth);
        private  provider = new  GoogleAuthProvider();
        user$ = user(this.auth);
        constructor() {}  

        ngOnInit(): void {} 

        login() {
                signInWithPopup(this.auth, this.provider).then((result) => {
                        const  credential = GoogleAuthProvider.credentialFromResult(result);
                        return  credential;
                })
        }

        logout() {
                signOut(this.auth).then(() => {
                        console.log('signed out');}).catch((error) => {
                                console.log('sign out error: ' + error);
                })
        }
      }