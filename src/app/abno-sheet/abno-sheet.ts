import { Component, inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { addDoc, collection } from "firebase/firestore";
import { Abnormality, AbnoData } from './abnoclass';
import { Sharedrules } from '../services/sharedrules';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-abno-sheet',
  imports: [CommonModule],
  templateUrl: './abno-sheet.html',
  styleUrl: './abno-sheet.css',
})
export class AbnoSheet {
  fireInit = inject(FireInit);
  rules= inject(Sharedrules);
    app = this.fireInit.app;
    db = this.fireInit.db;
    lang='en';
    AbnoSheet: Abnormality;
    AbnoData :AbnoData;
    depColor="var(--bonusdep-color)";
    dangerColor="var(--bonusdep-color)";
    HTclocks: string[]=[];
    constructor(){
  this.AbnoSheet=new Abnormality();
  this.AbnoData=new AbnoData();
  this.depColorUp(this.AbnoData.department);
  this.dangerColor=this.rules.dangerColorUp(this.AbnoSheet.danger);
  this.HTclocks[0]=this.rules.clockFiller(this.AbnoData.suppProg, this.AbnoSheet.suppClock);
  for(let i=0; i<this.AbnoSheet.trials.length; i++){this.HTclocks[i+1]=this.rules.clockFiller(this.AbnoData.trialClock[i], this.AbnoSheet.trials[i].Clock,'dodgerblue');}
}
addData() {
  const uData=this.AbnoData;
    const docRef = addDoc(collection(this.db, "charas"), {uData});
}

  depColorUp(c: string=this.AbnoData.department){
    let newC=this.rules.depColorUp(c);
    this.depColor=newC[0] as string;
  }
  clockFill(filled: number, max: number, color: string='red', background: string='dimgray'){
    return this.rules.clockFiller(filled, max, color, background); //per adesso è grigio ma potrebbe seguire il colore di background
  }
}
