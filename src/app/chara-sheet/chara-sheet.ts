import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
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

constructor(private ref: ChangeDetectorRef){
  this.Chara = new Character();
  this.vexpUpdate(1);
  this.vexpUpdate(2);
  this.vexpUpdate(3);
  this.vexpUpdate(4);
}
ngOnInit(){
    //this.getChara(1);
    this.depAbsUp();
    this.depColorUp();
    const form = document.getElementById('charForm') as HTMLFormElement;
// Add submit event listener
  form.addEventListener('submit', async (event) => {

  // Prevent default form submission (page reload)
  event.preventDefault();

  // Rest of the logic (collect data, updatewiew)
  const formData = new FormData(form);

let inp;
inp=formData.get('charName');
if(inp)this.Chara.fullName=inp.toString();
inp=formData.get('role1');
if(inp)this.Chara.role[0]=inp.toString();
inp=formData.get('role2');
if(inp)this.Chara.role[1]=inp.toString();
this.depAbsUp();
this.depColorUp();
inp=formData.get('armor');
if(inp)this.Chara.armor=(inp.toString()=='on'?true:false);
inp=formData.get('ability0');
if(inp){inp=inp.toString();
  this.Chara.abilities[0]=(inp=='Empty'?"":inp)}
inp=formData.get('ability1');
if(inp){inp=inp.toString();
  this.Chara.abilities[1]=(inp=='Empty'?"":inp)}
inp=formData.get('ability2');
if(inp){inp=inp.toString();
  this.Chara.abilities[2]=(inp=='Empty'?"":inp)}
inp=formData.get('trauma0');
if(inp){inp=inp.toString();
  this.Chara.trauma[0]=(inp=='Empty'?"":inp)}
inp=formData.get('trauma1');
if(inp){inp=inp.toString();
  this.Chara.trauma[1]=(inp=='Empty'?"":inp)}
inp=formData.get('trauma2');
if(inp){inp=inp.toString();
  this.Chara.trauma[2]=(inp=='Empty'?"":inp)}
inp=formData.get('exp');
if(inp)this.Chara.exp[0]=Number(inp);
inp=formData.get('Excel');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[0]=inp;}
inp=formData.get('Endure');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[1]=inp;}
inp=formData.get('Lurk');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[2]=inp;}
inp=formData.get('Rush');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[3]=inp;}
inp=formData.get('Observe');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[4]=inp;}
inp=formData.get('Consort');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[5]=inp;}
inp=formData.get('Hunt');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[6]=inp;}
inp=formData.get('Operate');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[7]=inp;}
inp=formData.get('Command');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[8]=inp;}
inp=formData.get('Skirmish');
if(inp){inp=Number(inp);
  if(inp>=0&&inp<5)this.Chara.skills[9]=inp;}
this.ref.markForCheck();
this.addChara();
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
    this.vexpUpdate(1);
    this.vexpUpdate(2);
    this.vexpUpdate(3);
    this.vexpUpdate(4);
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
      case "Control": this.depColor="var(--control-color)";
      break;
      case "Information": this.depColor="var(--info-color)";
      break;
      case "Training": this.depColor="var(--training-color)";
      break;
      case "Safety": this.depColor="var(--safety-color)";
      break;
      case "Central-Command": this.depColor="var(--central-color)";
      break;
      case "Disciplinary": this.depColor="var(--disc-color)";
      break;
      case "Welfare": this.depColor="var(--welfare-color)";
      break;
      case "Extraction": this.depText="var(--whitetext-color)"; this.depColor="var(--extraction-color)";
      break;
      case "Records": this.depColor="var(--records-color)";
      break;
      default: this.depColor="var(--bonusdep-color)";
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
    console.log("Chara saved: ", snapshot1.data());
  }
}
