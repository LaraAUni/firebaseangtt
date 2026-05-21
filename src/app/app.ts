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
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { FireInit } from './fire-init';
import { Userinfo } from './services/userinfo';
import { Rules } from './rules';
import { UserConverter } from './services/userdata';

@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AbnoSheet, Armoury, LoginPage, NgStyle],
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
  deps=Departments;
  showChara = 0;
  showAbno = 0;
  showArmo = 0;
  deleting=false;
  constructor(){
  }
  
  async deleteChara(n: number=this.rules.lookFor, d:number=this.rules.lookDep, id=this.rules.gameID, temp: boolean=true){
    if(n==0) return;
    if(!this.rules.isDM){
    let owns=false;
    for(let i=0; i<this.userd.info.characters.length;i++){
    let [game, findId]=this.userd.info.characters[i].split('-');
    console.log(this.userd.info.characters[i]);
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
    if(temp) this.rules.addRules();
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
    let nrules:Rules;
    nrules=await this.rules.findRules(id);
    if(!nrules.DMIds.includes(you)) return;
    nrules.charaList.forEach(element => {
      this.deleteChara(element, undefined, id, false);
    });
    nrules.abnoList.forEach(element => {
      this.deleteAbno(element, undefined, id, false);
    });
    this.iconsNames.deleteList(id,false);
    this.iconsNames.deleteList(id,true);
    nrules.DMIds.forEach(element=>{
      const useRef = doc(this.init.db, 'userdata/'+you).withConverter(new UserConverter());
      //da cancellare da user
    })
    this.rules.deleteRules(id);
  }

  charaPress(id:number){
    this.showRouterOutlet=0;
    //poi vai al numero aaaa
  }
}
