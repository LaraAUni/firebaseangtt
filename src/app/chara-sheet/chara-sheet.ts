import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventType, RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';
import { FireInit } from '../fire-init';
import { addDoc, getDoc, collection, setDoc, query, where, getFirestore, doc, DocumentSnapshot } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { Character, CharaConverter } from './characlass';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})

export class CharaSheet {
  fireInit = inject(FireInit);
  app = this.fireInit.app;
  db = this.fireInit.db;
  Chara : Character;
  lang='en';
  itapr="";
  abilitylist=["---"]
  controlAbs=["Manager, Shut It Down!", "Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"]
  infoAbs=["Solo Research","Foresight","Respectful Distance","Don't Act Rashly","The Rationality to Maintain Discretion"]
  safetyAbs=["Containment Protocols", "Dead Man Walking", "Bedside Manner", "Not On My Watch", "The Fearlessness to Keep On Living"]
  trainAbs=["Shadow", "Sink or Swim", "Right Out of the Handbook", "Stick to the Plan!", "The Hope to Be a Better Person"]
  discAbs=["Rabbit Protocol", "Big EGO", "Pain Bringer", "Vitality", "The Courage to Protect"]
  agentAbs=["Unassuming","Temporary Lucidity", "Face the Fear", "Virtuous", "Skilled"]
  traumas=["Cold","Haunted","Obsessed","Distrustful","Reckless","Soft","Volatile","Vicious"]
  Fort={track:[1,1,1,1,1,1]};Prud={track:[1,1,1,1,1,1]};Temp={track:[1,1,1,1,1,1]};Just={track:[1,1,1,1,1,1]};
  traum3nabled=false; //per il progetto che dà un'altro slot è completato (in gamerules/gamestate)
  activeDeps=["Control", "Information", "Safety", "Training", "Disciplinary"]
  oldSkill=true;
  depColor="var(--bonusdep-color)";
  depText="var(--blacktext-color)";

constructor(){
  this.Chara = new Character();
  this.Chara.role=["Agent","Disciplinary"];
  this.Chara.abilities=["Solo Research","Unassuming"]
  this.Chara.trauma=["Cold","Reckless",""]
  this.Chara.armor=false;
  this.Chara.exp[2]=3;
  this.Chara.exp[3]=4;
  this.Chara.exp[1]=1;
  this.vexpUpdate(1);
  this.vexpUpdate(2);
  this.vexpUpdate(3);
  this.vexpUpdate(4);
}
ngOnInit(){
    //this.getChara(1);
    this.depAbsUp();
    this.depColor=this.depColorUp();
    addEventListener("formdata", (e)=>{
      this.onsubmit(e.formData);
    });
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
  log(s:string){
    console.log(s)
  }
  selectedOp(op:string,val:string){
    return (op==val);
  }
  depAbsUp(c: string=this.Chara.role[1]){
    switch(c){
      case "Control": this.abilitylist=this.controlAbs;
      break;
      case "Information": this.abilitylist=this.infoAbs;
      break;
      case "Training": this.abilitylist=this.trainAbs;
      break;
      case "Safety": this.abilitylist=this.safetyAbs;
      break;
      case "Central-Command": this.abilitylist=["---"];
      break;
      case "Disciplinary": this.abilitylist=this.discAbs;
      break;
      case "Welfare": this.abilitylist=["---"];
      break;
      case "Extraction": this.abilitylist=["---"];
      break;
      case "Records": this.abilitylist=["---"];
      break;
      default: this.abilitylist=["---"];
    } //se aggiungo Regole Custom per ogni partita confrontare nomi dalle regole, ex case Rules.deps[9] : var(--customdep1-color)
  }
  depColorUp(c: string=this.Chara.role[1]){
    this.depText="var(--blacktext-color)";
    switch(c){
      case "Control": return "var(--control-color)";
      case "Information": return "var(--info-color)";
      case "Training": return "var(--training-color)";
      case "Safety": return "var(--safety-color)";
      case "Central-Command": return "var(--central-color)";
      case "Disciplinary": return "var(--disc-color)";
      case "Welfare": return "var(--welfare-color)";
      case "Extraction": this.depText="var(--whitetext-color)"; return "var(--extraction-color)";
      case "Records": return "var(--records-color)";
      default: return "var(--bonusdep-color)";
    } //se aggiungo Regole Custom per ogni partita confrontare nomi dalle regole, ex case Rules.deps[9] : var(--customdep1-color)
  }
  onsubmit(formdata: FormData){
    formdata.getAll
    for (const i of formdata.entries()) {
    console.log(i);
    }
  }
  vexpUpdate(n:number){
    let virt: number[];
    switch(n){
      case 1: virt=this.Fort.track;
      break;
      case 2: virt=this.Prud.track;
      break;
      case 3: virt=this.Temp.track;
      break;
      case 4: virt=this.Just.track;
      break;
      default: return;
    }
    let ex=this.Chara.exp[n];
    for(let i=0; i<ex; i++){
      virt[i]=0;
    }
    if(ex<6){
      for(let i=ex; i<6; i++) virt[i]=1;
    }
  }
  vexpUp(n:number){
    if(this.Chara.exp[n]<6){
    let virt: number[];
    switch(n){
      case 1: virt=this.Fort.track;
      break;
      case 2: virt=this.Prud.track;
      break;
      case 3: virt=this.Temp.track;
      break;
      case 4: virt=this.Just.track;
      break;
      default: return;
    }
      virt[this.Chara.exp[n]]=0;
      this.Chara.exp[n]++;
    }
  }
    vexpDown(n:number){
    if(this.Chara.exp[n]>0){
    let virt: number[];
    switch(n){
      case 1: virt=this.Fort.track;
      break;
      case 2: virt=this.Prud.track;
      break;
      case 3: virt=this.Temp.track;
      break;
      case 4: virt=this.Just.track;
      break;
      default: return;
    }
    this.Chara.exp[n]--;
    virt[this.Chara.exp[n]]=1;
    }
  }
  doubleHealthCic(a:number, b:number){
      if(!this.Chara.physHealth[a])this.Chara.physHealth[a]=!this.Chara.physHealth[a];
      else if(!this.Chara.physHealth[b])this.Chara.physHealth[b]=!this.Chara.physHealth[b]
      else{
        this.Chara.physHealth[a]=!this.Chara.physHealth[a];
        this.Chara.physHealth[b]=!this.Chara.physHealth[b]
      }
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
