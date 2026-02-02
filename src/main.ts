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



//TestUser: alphatt@gmail.com Password: sonoio
//CharID: Dep/(Player: Abno: Ego: Clerk)?1:2:3:4/CharaNum
/*
try {
  console.log("APP passato come ", app);
  console.log("DB passato come ", db);
  const docRef = addDoc(collection(db, "charas"), {
    gameID: 0,
    charID: 0,
    playerID: {Owner: ["AlphaTT"], Borrower: []},
    ImgUrl: "public/Charas/0000.png",
    fullName: { Name: "Alpha", Nickname: "", Surname: ""},
    role: ["Clerk","Control"],
    equip : [{imgUrl: "StandardW", Name: "Riot Stick"}, {imgUrl: "StandardS", Name: "Suit"}],
    abilities: ["","",""],
    stress: 0,
    trauma: ["","",""],
    physHealth: [false, false, false, false, false, false, false, false, false],
    mindHealth: [false, false, false, false, false, false, false, false, false],
    exp: 0,
    skills: [0,0,0,0,0,0,0,0,0,0],
    gifts : [{ imgUrl: "", Name: "", "Exp": 0 }],
    mapCoord: [0,0]
  });
} catch (e) {
  console.error("Error adding document: ", e);
}*/
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

  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
