import { Component, inject, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
import { Messages } from "./messages/messages";
import { Notifs } from './services/notifs';
import { GameService } from './services/game-service';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AbnoSheet, Armoury, LoginPage, NgStyle, Messages, FormsModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./app.css']
})

// Utilizza più componenti, non serve RouterOutlet

export class App {
  protected title = 'ThirdTrumpet';
  notifs=inject(Notifs);
  rules = inject(Sharedrules);
  iconsNames = inject(IconsNames);
  gameServ=inject(GameService);
  deps=Departments;
  showChara = 0;
  showAbno = 0;
  showArmo = 0;
  showRes=0;
  addAbno=false;
  selectedAbno: number = 0;
  deleting=false;
  deleteAbno=false;
  selectableAbnos=[{id:1, name:'Pinocchio'}, {id:2, name:'The Stars Go out'}, {id:3, name: 'Words of a Feather'}]
  constructor(){
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}}
  
  ngOnInit(){
  }

  onAbnoSelected() {
  if(this.selectedAbno==0) return;
  this.rules.lookFor = this.selectedAbno;
  this.showAbno = 1;
  this.addAbno = false;
}

  trumpetSound(n:number){
    this.notifs.trumpetSound(n);
    this.notifs.trumpets=n;
    this.notifs.addMessage(this.rules.gameID);
  }
  
}
