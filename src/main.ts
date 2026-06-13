import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { BrowserModule } from '@angular/platform-browser';
import { Routes } from "@angular/router"; 
import { Directive, HostListener } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { environment } from "./environments/environment";
import { LoginPage } from './app/login-page/login-page';
import { FireInit } from './app/fire-init';
import { addDoc, collection } from "firebase/firestore";
import { inject } from '@angular/core';

@Directive({
  selector: "[googleSso]",
})
export class GoogleSsoDirective {

  constructor(private angularFireAuth: AngularFireAuth) {
    
  }
  @HostListener("click")
  async onClick() {
    const creds = await this.angularFireAuth.signInWithPopup(
      new GoogleAuthProvider(),
    );
  }
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
