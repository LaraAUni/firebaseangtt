import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FireInit } from '../fire-init';
import { addDoc, collection } from "firebase/firestore";

@Component({
  selector: 'app-abno-sheet',
  imports: [NgTemplateOutlet],
  templateUrl: './abno-sheet.html',
  styleUrl: './abno-sheet.css',
})
export class AbnoSheet {
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
addChara() {
  const uChara=this.Chara;
    const docRef = addDoc(collection(this.db, "charas"), {uChara
  });
}
}
