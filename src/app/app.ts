import { Component, inject, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
import { doc, deleteDoc, getDoc, DocumentSnapshot, setDoc, namedQuery, waitForPendingWrites } from 'firebase/firestore';
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
  changeDetection: ChangeDetectionStrategy.Default,
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
  
  
  ngOnInit(){
  }

  async deleteChara(n: number=this.rules.lookFor, dep:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    if(n==0) return;
    if(this.userd.info.characters.includes(name+date+n)){
    this.userd.info.characters=this.userd.info.characters.filter(c=>c!=name+date+n);
    this.userd.addUser();
    }else if(!this.rules.isDM)return;

    const charRef = doc(this.init.db, 'charas/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    await deleteDoc(charRef);
    if(temp){
    if(dep){
    let ind=this.rules.depsList.indexOf(dep);
    if(ind==-1) ind=6;
    if(this.rules.deadCh.includes(n)){
      ind=7;
      this.rules.deadCh=this.rules.deadCh.filter(c=>c!=n);
    }
      else this.rules.charaList=this.rules.charaList.filter(c=>c!=n);

    this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=n);
    }
    this.rules.addRules();
    } //temp vuol dire che non è per cancellare la partita, altrimenti rischio di salvare le regole dopo che sono state cancellate perché è asynch
  }

  async deleteAbno(n: number=this.rules.lookFor, d:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    const abnoRef = doc(this.init.db, 'gameabnos/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    if(!this.rules.isDM) return;
    await deleteDoc(abnoRef);
    if(temp){ 
    if(d){
      let ind=this.rules.depsList.indexOf(d);
      this.rules.abnoList=this.rules.abnoList.filter(c=>c!=n);
      this.iconsNames.ordAbnoList[ind]=this.iconsNames.ordAbnoList[ind].filter(c=>c.id!=n);
    } this.rules.addRules();
    }
  }

  async deleteGame(name:string, date:number, you:string=this.userd.id){
    const rulesRef=doc(this.init.db, 'rules/' + name + '-' + date).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    let uRules = snapshot1.data()!;

    if(!uRules.DMIds.includes(you)) return;
    for (const element of uRules.charaList) {this.deleteChara(element, undefined, name, date, false);}
    for (const element of uRules.deadCh){this.deleteChara(element, undefined, name, date, false);}
    for (const element of uRules.abnoList){this.deleteAbno(element, undefined, name, date, false);}
    this.iconsNames.deleteList(false, name, date);
    this.iconsNames.deleteList(true, name, date);

    for (const element of uRules.DMIds){
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            let datee=date.toString();
            let l=uInfo.characters.length;
            for(let i=0;i<l;i++){
              let [nam,dat,num]=uInfo.characters[i].split('-');
              if(nam==name && dat==datee){ uInfo.characters=uInfo.characters.filter(c=>c!=uInfo.characters[i]);
                l--;
                i--;
              }
            }
            await setDoc(userRef, uInfo)
            if(element==you) this.userd.info=uInfo;
    }
    for (const element of uRules.playerIDs){
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            let datee=date.toString();
            let l=uInfo.characters.length;
            for(let i=0;i<l;i++){
              let [nam,dat,num]=uInfo.characters[i].split('-');
              if(nam==name && dat==datee){ uInfo.characters=uInfo.characters.filter(c=>c!=uInfo.characters[i]);
                l--;
                i--;
              }
            }
            await setDoc(userRef, uInfo);
    }
    await this.rules.deleteRules(date, name);
  }

  trumpetSound(n:number){
    this.notifs.trumpetSound(n);
    this.notifs.trumpets=n;
    this.notifs.addMessage(this.rules.gameID);
  }
}
