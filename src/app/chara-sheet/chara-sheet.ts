import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';
import { FireInit } from '../fire-init';
import { addDoc, getDoc, collection, setDoc, query, where, getFirestore, doc, DocumentSnapshot } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { initializeApp } from "firebase/app";
import { Character, CharaConverter } from './characlass';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet, MatListModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})

export class CharaSheet {
  fireInit = inject(FireInit);
  app = this.fireInit.app;
  db = this.fireInit.db;
  Chara : Character;
  abilities=["Fearlessness to Keep on Living","Discretion","Courage"]
constructor(){
  this.Chara = new Character();
}
  ngOnInit(){
    this.getChara(1);
  }

  async getChara(id:number): Promise<void> {
    const charRef = doc(this.db, 'charas/'+id).withConverter(new CharaConverter());
    const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
    const uChara: Character = snapshot1.data()!;
    if (uChara) {
    this.Chara = uChara;
    }
    console.log("thisChara: ", this.Chara);
  }

  depColorUp(c: string=this.Chara.role[1]){
    switch(c){
      case "Control": return "var(--control-color)";
      case "Information": return "var(--info-color)";
      case "Training": return "var(--training-color)";
      case "Safety": return "var(--safety-color)";
      case "Central-Command": return "var(--central-color)";
      case "Disciplinary": return "var(--disc-color)";
      case "Welfare": return "var(--welfare-color)";
      case "Extraction": return "var(--extraction-color)";
      case "Records": return "var(--records-color)";
      default: return "var(--bonusdep-color";
    }
  }

  depText(c: string=this.Chara.role[1]){
    if(c=='Extraction'){
      return 'var(--whitetext-color)';
    }
    return 'var(--blacktext-color)';
  }

  vexpTrack(exp:number){

  }

  hurt(h:boolean){
    if(h){return "X"} else {return ""}
  }
  
  virtCalc(a : number, b : number, c : number, d : number){
    return (this.Chara.skills[a]?1:0) + (this.Chara.skills[b]?1:0) + (this.Chara.skills[c]?1:0) + (this.Chara.skills[d]?1:0);
  }
  async addChara() : Promise<void>{
    const charRef = doc(this.db, 'charas/'+this.Chara.charID).withConverter(new CharaConverter());
    await setDoc(charRef, this.Chara);
    const snapshot1 = await getDoc(charRef);
    console.log("Chara salvato: ", snapshot1.data());
  }
}
