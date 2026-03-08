import { Component, inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { addDoc, collection } from "firebase/firestore";

@Component({
  selector: 'app-abno-sheet',
  imports: [],
  templateUrl: './abno-sheet.html',
  styleUrl: './abno-sheet.css',
})
export class AbnoSheet {
  fireInit = inject(FireInit);
    app = this.fireInit.app;
    db = this.fireInit.db;
    lang='en';
    Chara;
    constructor(){
  this.Chara={ //da fare Abnosheet, si possono fare orologi con conic gradient in CSS e attr() per le percentuali
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
  gift : { imgUrl: "EGOGiftFrostShard", Name: "Words of Winter", Exp: 3 }, //gifts è un placeholder per Info e Storia
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
