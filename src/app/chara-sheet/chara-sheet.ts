import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';
import { FireInit } from '../fire-init';
import { addDoc, getDocs, collection, setDoc, query, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { initializeApp } from "firebase/app";
import { Characlass } from './characlass';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet, MatListModule],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})

export class CharaSheet {
  fireInit = inject(FireInit);
  app = this.fireInit.app;
  db = this.fireInit.db;
  Chara : Characlass;
constructor(){
  this.Chara=new Characlass();
  this.Chara.gifts=[];
}

  async findChara(id:number){
    const charaRef = collection(this.db, "charas");
// Create a query against the collection.
    const q = query(charaRef, where("charID", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
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

  addChara() {
    const uChara=this.Chara;
    const docRef = addDoc(collection(this.db, "charas"), {uChara
  });
  }


}
