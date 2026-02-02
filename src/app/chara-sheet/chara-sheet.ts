import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';
import { FireInit } from '../fire-init';
import { addDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet, MatListModule],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})
export class CharaSheet {
  fireInit = inject(FireInit);
  app = this.fireInit.app;
  db = this.fireInit.db;
  Chara;

constructor(){
  this.Chara={
  gameID : 0,
  charID : 0,
  playerID : { Owner: ["AlphaTT"], Borrower: [] },
  ImgUrl: "0000",
  fullName : { Name: "Alpha", Nickname: "", Surname: "" },
  role : ["Clerk", "Control"],
  equip : [{imgUrl: "StandardW", Name: "Riot Stick"}, {imgUrl: "StandardS", Name: "Suit"}],
  abilities : ["", "", ""],
  stress : 0,
  trauma : ["", "", ""],
  physHealth : [false, false, false, false, false, false, false, false, false],
  mindHealth : [false, false, false, false, false, false, false, false, false],
  exp : [0, 0, 0, 0, 0],
  skills : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  gifts : [{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 },{ imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 }],
  mapCoord : [0, 0],
  }
}

  depColor(c: string=this.Chara.role[1]){
    switch(c){
      case "Control": return "--control-color";
      case "Information": return "--info-color";
      case "Training": return "--training-color";
      case "Information": return "--info-color";
      case "Safety": return "--safety-color";
      case "Central-Command": return "--central-color";
      case "Disciplinary": return "--disc-color";
      case "Welfare": return "--welfare-color";
      case "Extraction": return "--extraction-color";
      case "Records": return "--records-color";
      default: return "--bonusdep-color";
    }
  }

  hurt(h:boolean){
    if(h){return "X"} else {return ""}
  }
  
  VirtCalc(a : number, b : number, c : number, d : number){
    return (this.Chara.skills[a]?1:0) + (this.Chara.skills[b]?1:0) + (this.Chara.skills[c]?1:0) + (this.Chara.skills[d]?1:0);
  }

  addChara() {
    const app= this.fireInit.app;
    const db = this.fireInit.db;
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
  }


}
