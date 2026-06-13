import { Component, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatExpansionModule} from '@angular/material/expansion';
import { CharaSheet } from './chara-sheet/chara-sheet';
import { AbnoSheet } from './abno-sheet/abno-sheet';
import { Armoury } from './armoury/armoury';
import { MyMap } from './my-map/my-map';
import {MatListModule} from '@angular/material/list';
import { LoginPage } from "./login-page/login-page";
import { Sharedrules, Departments } from './services/sharedrules';
import { IconsNames } from './services/icons-names';
import { NgStyle } from '@angular/common';
import { CharaConverter } from './chara-sheet/characlass';
import { doc, deleteDoc, getDoc, DocumentSnapshot, setDoc } from 'firebase/firestore';
import { FireInit } from './fire-init';
import { Userinfo } from './services/userinfo';
import { Rules, RulesConverter } from './rules';
import { UserConverter, UserData } from './services/userdata';
import { Messages } from "./messages/messages";
import { Notifs } from './services/notifs';

@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AbnoSheet, Armoury, LoginPage, NgStyle, Messages],
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
  deleting=false;
  constructor(private ref: ChangeDetectorRef){
  }
  
  async deleteChara(n: number=this.rules.lookFor, d:number=this.rules.lookDep, id=this.rules.gameID, temp: boolean=true){
    if(n==0) return;
    if(!this.rules.isDM){
    let owns=false;
    for(let i=0; i<this.userd.info.characters.length;i++){
    let [game, findId]=this.userd.info.characters[i].split('-');
    if(Number(game)!=this.rules.gameID) continue;
    if(Number(findId)==n) owns=true;
    break;
    }
    if(!owns) return;
    }
    const charRef = doc(this.init.db, 'charas/' + id + '-' + n).withConverter(new CharaConverter());
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

  async deleteAbno(n: number=this.rules.lookFor, d:number=this.rules.lookDep, id=this.rules.gameID, temp: boolean=true){
    const abnoRef = doc(this.init.db, 'gameabnos/' + id + '-' + n).withConverter(new CharaConverter());
    if(!this.rules.isDM) return;
    if(d){
    let ind=this.rules.depsList.indexOf(d);
    this.rules.abnoList=this.rules.abnoList.filter(c=>c!=n);
    this.iconsNames.ordAbnoList[ind]=this.iconsNames.ordAbnoList[ind].filter(c=>c.id!=n);
    }
    await deleteDoc(abnoRef);
    if(temp) this.rules.addRules();
  }

  async deleteGame(id:number, you:string=this.userd.id){
    const rulesRef=doc(this.init.db, 'rules/' + id).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    let uRules = snapshot1.data()!;
    if(!uRules.DMIds.includes(you)) return;
    uRules.charaList.forEach(element => {
      this.deleteChara(element, undefined, id, false);
    });
    uRules.deadCh.forEach(element => {
      this.deleteChara(element, undefined, id, false);
    });
    uRules.abnoList.forEach(element => {
      this.deleteAbno(element, undefined, id, false);
    });
    this.iconsNames.deleteList(id,false);
    this.iconsNames.deleteList(id,true);
    uRules.DMIds.forEach(async element=>{
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.id!=id);
            setDoc(userRef, uInfo)
            if(element==you) this.userd.info=uInfo;
    })
    uRules.playerIDs.forEach(async element=>{
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.id!=id);
            setDoc(userRef, uInfo);
    })
    this.rules.deleteRules(id);
  }
  trumpetSound(n:number){
    this.notifs.trumpetSound(n);
    this.notifs.trumpets=n;
    this.notifs.addMessage(this.rules.gameID);
  }
}
