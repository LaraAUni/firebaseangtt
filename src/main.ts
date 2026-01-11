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


@Directive({
  selector: "[googleSso]",
})
export class GoogleSsoDirective {
  constructor(private angularFireAuth: AngularFireAuth) {}
  @HostListener("click")
  async onClick() {
    const creds = await this.angularFireAuth.signInWithPopup(
      new GoogleAuthProvider(),
    );
  }
}
const firebaseConfig = {
  apiKey: "AIzaSyAl6MOHLbKkHSp2UTNmmkzRZphfthmEn3E",
  authDomain: "third-trumpet.firebaseapp.com",
  projectId: "third-trumpet",
  storageBucket: "third-trumpet.firebasestorage.app",
  messagingSenderId: "218218565698",
  appId: "1:218218565698:web:e02d7bf55af32ab7251ddb",
  measurementId: "G-3RHTFBTNWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//TestUser: alphatt@gmail.com Password: sonoio
//CharID: Dep/(Player: Abno: Ego: Clerk)?1:2:3:4/CharaNum

//try {
/*
  const docRef = await addDoc(collection(db, "users"), {
    email: "alphatt@gmail.com",
    nickname: "AlphaTT",
    gameIDs: [0o1, 0o3],
    charIDs: [[1101], [2102, 3102]],
  });
  const docRef = await addDoc(collection(db, "games"), {
    gameID: "00001",
    DMList: ["AlphaTT"],
    playerList: ["BetaTT", "GammaTT"],
  });
  const docRef = await addDoc(collection(db, "gamedata"), {
    gameID: "00001",
    coords: [[1101,32],[2102, 57], [1201, 33]],
    messages:"[Game Start!,AlphaTT: Welcome!]"
  });
  */
 /*
  const docRef = await addDoc(collection(db, "charas"), {
    gameID: "00001",
    charID: 0000,
    playerID: [["alphatt"],[]], //Owner, Borrower (can't pass ownership),
        "ImgUrl":"public/Charas/0000.png",
        "name":"Alpha",
        "surname":"",
        "role":"Clerk",
        "equip":["StandardW","StandardW"],
        "abilities":["","",""],
        "stress":0,
        "trauma":["","",""],
        "physHealth":[0,0,0,0,0,0,0,0,0],
        "mindHealth":[0,0,0,0,0,0,0,0,0],
        "exp":0,
        "skills":[0,0,0,0,0,0,0,0,0,0],
        "virtues":[0,0,0,0],
        "gifts":[["",0],["",0],["",0],["",0],["",0]]
    
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
