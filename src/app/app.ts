import { Component, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatExpansionModule} from '@angular/material/expansion';
import { CharaSheet } from './chara-sheet/chara-sheet';
import { AbnoSheet } from './abno-sheet/abno-sheet';
import { Armoury } from './armoury/armoury';
import { Research } from './research/research';
import { MyMap } from './my-map/my-map';
import {MatListModule} from '@angular/material/list';
import { LoginPage } from "./login-page/login-page";
import { Sharedrules, Departments } from './services/sharedrules';
import { IconsNames } from './services/icons-names';
import { NgStyle } from '@angular/common';
import { CharaConverter } from './chara-sheet/characlass';
import { doc, deleteDoc, getDoc, DocumentSnapshot, setDoc, namedQuery } from 'firebase/firestore';
import { FireInit } from './fire-init';
import { Userinfo } from './services/userinfo';
import { Rules, RulesConverter } from './rules';
import { UserConverter, UserData } from './services/userdata';
import { Messages } from "./messages/messages";
import { Notifs } from './services/notifs';
@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AbnoSheet, Armoury, Research, LoginPage, NgStyle, Messages],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

// Utilizza più componenti, non serve RouterOutlet

export class App {
  protected title = 'ThirdTrumpet';
  rules = inject(Sharedrules);
  iconsNames = inject(IconsNames);
  init=inject(FireInit);
  userd=inject(Userinfo)
  notifs=inject(Notifs);
  deps=Departments;
  showChara = 0;
  showAbno = 0;
  showArmo = 0;
  showRes=0;
  addAbno=false;
  deleting=false;
  constructor(private ref: ChangeDetectorRef){
  }
  

  async deleteChara(n: number=this.rules.lookFor, d:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    if(n==0) return;
    if(!this.rules.isDM){
    let owns=false;
    for(let i=0; i<this.userd.info.characters.length;i++){
    let [game, findId]=this.userd.info.characters[i].split('-');
    if(Number(game)!=date) continue;
    if(Number(findId)==n) owns=true;
    break;
    }
    if(!owns) return;
    }
    const charRef = doc(this.init.db, 'charas/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    if(d){
    let ind=this.rules.depsList.indexOf(d);
    if(ind==-1) ind=6;
    if(this.rules.deadCh.includes(n)){
      ind=7;
      this.rules.deadCh=this.rules.deadCh.filter(c=>c!=n);
    }
      else this.rules.charaList=this.rules.charaList.filter(c=>c!=n);

    this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=n);
    }
    await deleteDoc(charRef);
    if(temp) this.rules.addRules(); //temp vuol dire che non è per cancellare la partita, altrimenti rischio di salvare le regole dopo che sono state cancellate perché è asynch
  }

  async deleteAbno(n: number=this.rules.lookFor, d:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    const abnoRef = doc(this.init.db, 'gameabnos/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    if(!this.rules.isDM) return;
    if(d){
    let ind=this.rules.depsList.indexOf(d);
    this.rules.abnoList=this.rules.abnoList.filter(c=>c!=n);
    this.iconsNames.ordAbnoList[ind]=this.iconsNames.ordAbnoList[ind].filter(c=>c.id!=n);
    }
    await deleteDoc(abnoRef);
    if(temp) this.rules.addRules();
  }

  async deleteGame(name:string, date:number, you:string=this.userd.id){
    const rulesRef=doc(this.init.db, 'rules/' + name + '-' + date).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    let uRules = snapshot1.data()!;
    if(!uRules.DMIds.includes(you)) return;
    uRules.charaList.forEach(element => {
      this.deleteChara(element, undefined, name, date, false);
    });
    uRules.deadCh.forEach(element => {
      this.deleteChara(element, undefined, name, date, false);
    });
    uRules.abnoList.forEach(element => {
      this.deleteAbno(element, undefined, name, date, false);
    });
    this.iconsNames.deleteList(false, name, date);
    this.iconsNames.deleteList(true, name, date);
    uRules.DMIds.forEach(async element=>{
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            setDoc(userRef, uInfo)
            if(element==you) this.userd.info=uInfo;
    })
    uRules.playerIDs.forEach(async element=>{
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            setDoc(userRef, uInfo);
    })
    this.rules.deleteRules(date, name);
  }

  trumpetSound(n:number){
    this.notifs.trumpetSound(n);
    this.notifs.trumpets=n;
    this.notifs.addMessage(this.rules.gameID);
  }
}
/*
let swRegistration = null;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      swRegistration = reg;
    });
}
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
});
const cacheName = "ttcache-v1";
const appShellFiles = [
  "/",
  "/index.html",
  "/app.js",
  "/style.css",
  "/public/BebasKai.otf",
  "/public/Gill Sans.otf",
  "/public/Mikodacs.otf",
  "/public/Norwester.otf",
  "/public/ThirdIco.ico",
  "/public/User.png",
  "/public/Undo.ico",
  "/public/RedDamage.png",
  "/public/BlackDamage.png",
  "/public/WhiteDamage.png",
  "/public/PaleDamage.png",
  "/public/Instinct.png",
  "/public/Insight.png",
  "/public/Attachment.png",
  "/public/Repression.png",
];
*/