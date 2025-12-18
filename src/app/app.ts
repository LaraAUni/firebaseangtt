'use client';
import { Component, Input, inject} from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { timeInterval } from 'rxjs';
import { MatExpansionModule} from '@angular/material/expansion';
import { CharaSheet } from './chara-sheet/chara-sheet';
import { AbnoSheet } from './abno-sheet/abno-sheet';
import { SidebarService } from './services/sidebar.service';
import { Sidebids } from '../../public/data/sidebids';
import { MyMap } from './my-map/my-map';
import {MatListModule} from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAl6MOHLbKkHSp2UTNmmkzRZphfthmEn3E",
  authDomain: "third-trumpet.firebaseapp.com",
  projectId: "third-trumpet",
  storageBucket: "third-trumpet.firebasestorage.app",
  messagingSenderId: "218218565698",
  appId: "1:218218565698:web:e02d7bf55af32ab7251ddb",
  measurementId: "G-3RHTFBTNWY"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ThirdTrumpet';
  showRouterOutlet = 0;
  characterId={id:0, name:''}
  idsList: Sidebids[]=[]
  playerIdsList: Sidebids[]|undefined
  abnoIdsList: Sidebids[]|undefined
  egoIdsList: Sidebids[]|undefined
  SidebarService: SidebarService = inject(SidebarService);
  constructor(){
    this.idsList=this.SidebarService.getAllIds();
    this.playerIdsList=this.idsList.filter(idsList=>idsList.type == "playerch");
    this.abnoIdsList=this.idsList.filter(idsList=>idsList.type == "abnoch");
    this.egoIdsList=this.idsList.filter(idsList=>idsList.type == "playerch");
  }
  charaPress(id:number){
    this.showRouterOutlet=1;
    //poi vai al numero aaaa
  }
}
