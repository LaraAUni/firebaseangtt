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
import { doc, deleteDoc } from 'firebase/firestore';
import { FireInit } from './fire-init';

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
  deps=Departments;
  showChara = 0;
  showAbno = 0;
  showArmo = 0;
  deleting=false;
  constructor(){
  }
  
  ngOnInit(){
    this.rules.getRules().then((e)=>{
      this.iconsNames.makeList(true);
      this.iconsNames.makeList(false);
    })
    
  }

  async deleteChara(n: number=this.rules.lookFor, d:number=this.rules.lookDep){
    if(n==0) return;
    const charRef = doc(this.init.db, 'charas/' + this.rules.gameID + '-' + n).withConverter(new CharaConverter());
    let ind=this.rules.depsList.indexOf(d);
    if(ind==-1) ind=6;
    if(this.rules.deadCh.includes(n)){
      ind=7;
      this.rules.deadCh=this.rules.deadCh.filter(c=>c!=n);
    }
      else this.rules.charaList=this.rules.charaList.filter(c=>c!=n);

    this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=n);
    await deleteDoc(charRef);
    this.rules.addRules();
  }

  charaPress(id:number){
    this.showChara=1;
    //poi vai al numero aaaa
  }
}
