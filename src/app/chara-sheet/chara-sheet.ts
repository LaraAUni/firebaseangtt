import { Component, Inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FireInit } from '../fire-init';
import { addDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";


@Component({
  selector: 'app-chara-sheet',
  imports: [NgTemplateOutlet, RouterOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})
export class CharaSheet {
  fireInit = Inject(FireInit);
  app = this.fireInit.app;
  db = this.fireInit.db;
  
  gameID = 0;
  charID = 0;
  playerID = { owner: ["AlphaTT"], borrower: [] };
  fullName = { name: "Alpha", surname: "", "nickname": "" };
  role = "Clerk";
  equip = ["StandardW", "StandardW"];
  abilities = ["", "", ""];
  stress = 0;
  trauma = ["", "", ""];
  physHealth = [false, false, false, false, false, false, false, false, false];
  mindHealth = [false, false, false, false, false, false, false, false, false];
  exp = 0;
  skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  virtues = [0, 0, 0, 0];
  gifts = [{ Name: "", "Exp": 0 }, { Name: "", Exp: 0 }, { Name: "", Exp: 0 }, { Name: "", Exp: 0 }, { Name: "", Exp: 0 }];
  mapCoord = [0, 0];

  
  OnInit() {

  console.log("identificatore passato come ", this.db);
  const docRef = addDoc(collection(this.db, "charas"), {
    gameID: 0,
    charID: 0,
    playerID: {Owner: ["AlphaTT"], Borrower: []}, //Borrower ha solo un permesso revocabile
    ImgUrl: "public/Charas/0000.png",
    fullName: {Surname: "", Nickname: "", Name: "Alpha"},
    role: "Clerk",
    equip:["StandardW", "StandardW"],
    abilities: ["","",""],
    stress: 0,
    trauma: ["","",""],
    physHealth: [false, false, false, false, false, false, false, false, false],
    mindHealth: [false, false, false, false, false, false, false, false, false],
    exp: 0,
    skills: [0,0,0,0,0,0,0,0,0,0],
    virtues: [0,0,0,0],
    gifts: [{Name: "",Exp: 0},{Name: "",Exp: 0},{Name: "",Exp: 0},{Name: "",Exp: 0},{Name: "",Exp: 0}],
    mapCoord: [0,0]
  });

  }


  getFullName() {
    return;
  }
}
