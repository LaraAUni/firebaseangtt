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
  deps=Departments;
  showChara = 0;
  showAbno = 0;
  showArmo = 0;
  deleting=false;
  readonly cdr = inject(ChangeDetectorRef)
  constructor(){
  }
  
  @ViewChild(CharaSheet) chara!: CharaSheet;

  async deleteChara(id:number, dep: number){
    this.chara.deleteChara(id, dep);
    this.cdr.detectChanges;
  }

  charaPress(id:number){
    this.showChara=1;
    //poi vai al numero aaaa
  }
}
