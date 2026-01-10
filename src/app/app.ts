import { NgModule } from "@angular/core";
import { Component, Input, inject} from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { timeInterval } from 'rxjs';
import { Routes } from "@angular/router"; 
import { MatExpansionModule} from '@angular/material/expansion';
import { CharaSheet } from './chara-sheet/chara-sheet';
import { AbnoSheet } from './abno-sheet/abno-sheet';
import { SidebarService } from './services/sidebar.service';
import { Sidebids } from '../../public/data/sidebids';
import { MyMap } from './my-map/my-map';
import {MatListModule} from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatExpansionModule, MatListModule, MyMap, CharaSheet, AsyncPipe, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})



export class App {
  protected title = 'ThirdTrumpet';
  showRouterOutlet = 1;
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
    this.showRouterOutlet=0;
    //poi vai al numero aaaa
  }
}