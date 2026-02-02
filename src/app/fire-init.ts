import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


@Injectable({
  providedIn: 'root',
})

export class FireInit {
  public firebaseConfig;
  public APP;
  public DB;
constructor() { 
  this.firebaseConfig = {
  apiKey: "AIzaSyAl6MOHLbKkHSp2UTNmmkzRZphfthmEn3E",
  authDomain: "third-trumpet.firebaseapp.com",
  projectId: "third-trumpet",
  storageBucket: "third-trumpet.firebasestorage.app",
  messagingSenderId: "218218565698",
  appId: "1:218218565698:web:e02d7bf55af32ab7251ddb",
  measurementId: "G-3RHTFBTNWY"};
  this.APP = initializeApp(this.firebaseConfig);
  this.DB = getFirestore(this.app);
}
// Initialize Firebase

public get app(){
  return this.APP;
}
public get db() {
  return this.DB;
}
}
