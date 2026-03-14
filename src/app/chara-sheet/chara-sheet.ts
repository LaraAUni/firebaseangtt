import { ChangeDetectorRef, Component, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FireInit } from '../fire-init';
import { getDoc, setDoc, doc, DocumentSnapshot } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { Character, CharaConverter } from './characlass';
import { Sharedrules } from '../services/sharedrules';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})

export class CharaSheet {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  db = this.fireInit.db;
  Chara : Character;
  lang='en';
  itapr="";//per prendere le abilità in italiano quando le aggiungo se non sono custom scelte da DM
  abilitylist=["---"]
  controlAbs=this.rules.controlAbs
  infoAbs=this.rules.infoAbs;
  safetyAbs=this.rules.safetyAbs;
  trainAbs=this.rules.trainAbs;
  discAbs=this.rules.discAbs;
  agentAbs=this.rules.agentAbs;
  traumas=this.rules.traumas;
  Fort={track:[1,1,1,1,1,1]};Prud={track:[1,1,1,1,1,1]};Temp={track:[1,1,1,1,1,1]};Just={track:[1,1,1,1,1,1]};
  traum3nabled=this.rules.traum3nabled; //per il progetto che dà un'altro slot se completato (in gamerules/gamestate)
  activeDeps=this.rules.depsList;
  depColor="var(--bonusdep-color)";//default è colore di Angela perché non avrebbe senso fosse assegnabile
  depText="#010101";

constructor(private ref: ChangeDetectorRef){
  this.Chara = new Character();
}

ngOnInit(){
  this.getChara(0);
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
inp=formData.get('stress');
if(inp){inp=Number(inp);
  if(this.Chara.role[0]=='Captain'){if(inp>=0&&inp<9)this.Chara.stress=inp;}
  else{if(inp>=0&&inp<7)this.Chara.stress=inp;}
}
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
inp=formData.get('exp1');
if(inp){this.Chara.exp[1]=Number(inp);
    this.vexpUpdate(1);}
inp=formData.get('exp2');
if(inp){this.Chara.exp[2]=Number(inp);
    this.vexpUpdate(2);}
inp=formData.get('exp3');
if(inp){this.Chara.exp[3]=Number(inp);
    this.vexpUpdate(3);}
inp=formData.get('exp4');
if(inp){this.Chara.exp[4]=Number(inp);
    this.vexpUpdate(4);}
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
    this.vexpUpdate(1);
    this.vexpUpdate(2);
    this.vexpUpdate(3);
    this.vexpUpdate(4);
    this.depAbsUp();
    this.depColorUp();
    this.ref.markForCheck();
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
    } //Con le Regole Custom per ogni partita confrontare nomi dalle regole, ex case Rules.deps[9] : var(--customdep1-color)
  }
  depColorUp(c: string=this.Chara.role[1]){
    this.depText="#010101";
    let newC=this.rules.depColorUp(c);
    if(newC[1])this.depText="aliceblue";
    this.depColor=newC[0] as string;
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
    if(this.Chara.charID==0) return; //per evitare di sovrascrivere il char0 di default quando si preme salva senza aver caricato un char o creato un nuovo char con id diverso da 0
    const charRef = doc(this.db, 'charas/'+this.Chara.charID).withConverter(new CharaConverter());
    await setDoc(charRef, this.Chara);
    const snapshot1 = await getDoc(charRef);
    console.log("Chara saved: ", snapshot1.data());
  }
}
