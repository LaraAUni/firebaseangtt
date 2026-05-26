import { ChangeDetectorRef, Component, inject,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FireInit } from '../fire-init';
import { getDoc, setDoc, doc, DocumentSnapshot, deleteDoc } from "firebase/firestore";
import { NgTemplateOutlet } from '@angular/common';
import { Character, CharaConverter } from './characlass';
import { Sharedrules , Departments} from '../services/sharedrules';
import { IconsNames } from '../services/icons-names';
import { Userinfo } from '../services/userinfo';
import { Notifs } from '../services/notifs';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})


export class CharaSheet {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  iconsNames = inject(IconsNames);
  userd=inject(Userinfo);
  notifs=inject(Notifs);
  deps=Departments;
  db = this.fireInit.db;
  Chara : Character;
  charID=0;
  lang='en';
  isdead=false;
  itapr="";//per prendere le abilità in italiano quando le aggiungo se non sono custom scelte da DM
  captAbs=["---"]
  Fort={track:[1,1,1,1,1,1]};Prud={track:[1,1,1,1,1,1]};Temp={track:[1,1,1,1,1,1]};Just={track:[1,1,1,1,1,1]};
  depColor="var(--Bonus)";//deve essere una variabile cambiata dalla funzione perché mettendo la funzione direttamente nell'html Angular la ricalcola tre volte
  depText="#010101";
  depChange=false;
  oldDep=0;
  new=false;
  owns=false;
constructor(private ref: ChangeDetectorRef){
  this.Chara = new Character();
}

ngOnInit(){
  if(this.rules.lookFor){this.charID=this.rules.lookFor; this.getChara(this.charID);}
  else{this.Chara.role[1]=this.rules.lookDep; this.depColorUp();
    this.owns=true
    let maxA:number;
    if(this.rules.charaList.length) maxA=Math.max(...this.rules.charaList);
    else  maxA=0;
    let maxD:number;
    if(this.rules.deadCh.length) maxD=Math.max(...this.rules.deadCh);
    else  maxD=0;
    console.log('Alive:',maxA,'Dead:', maxD)
    this.charID=(maxA>maxD?maxA+1:maxD+1);
    this.new=true;
    this.rules.lookFor=this.charID;
  }
  this.oldDep=this.Chara.role[1];
  const form = document.getElementById('charForm') as HTMLFormElement;
// Add submit event listener
  form.addEventListener('submit', async (event) => {

  // Prevent default form submission (page reload)
  event.preventDefault();

  // Rest of the logic (collect data, updatewiew)
const formData = new FormData(form);

if(!this.owns) return;

let inp;
this.oldDep=this.Chara.role[1];
inp=formData.get('charName');
if(inp){this.Chara.fullName=inp.toString();}
inp=formData.get('role1');
if(inp)this.Chara.role[0]=inp.toString();
inp=formData.get('role2');
if(inp)this.Chara.role[1]=Number(inp);
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

  
  let ind=this.rules.depsList.indexOf(this.oldDep); //oldDep in caso è nuovo e per far funzionare Changedep
  if(this.oldDep==0) ind=6;
  if(this.isdead) ind=7;

  if(this.new){
    ind=this.rules.depsList.indexOf(this.Chara.role[1]);
    if(this.Chara.role[1]==0) ind=6
    this.rules.charaList=[...this.rules.charaList, this.charID];
    this.iconsNames.ordCharaList[ind]=[...this.iconsNames.ordCharaList[ind], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
    this.new=false;
    this.userd.info.characters=[...this.userd.info.characters, this.rules.gameID + '-' + this.charID];
    this.userd.addUser();
    this.rules.addRules();
  } else{
  let charIndex = this.iconsNames.ordCharaList[ind].findIndex(c => c.id === this.charID); //aggiornare subito il nome per evitare che si perda negli altri casi speciali
  this.iconsNames.ordCharaList[ind][charIndex].name=this.Chara.fullName;
  
  if(this.depChange){
    if(this.oldDep!=this.Chara.role[1]){
    let newind=this.rules.depsList.indexOf(this.Chara.role[1]); //se Select viene selezionato ma rimesso uguale od è nuovo saltare
    if(this.isdead=false){ //non serve aggiornare Dead ma il dipartimento sì in caso Dead si aggiorna al prossimo step
    if(newind==-1) newind=6;
    this.iconsNames.ordCharaList[newind]=[...this.iconsNames.ordCharaList[newind], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
    this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=this.charID); //se era in riserva si deve togliere dalla lista di riserva
    this.depChange=false;
  }
    ind=newind;
}
}
}
    if(this.Chara.physHealth[5]||this.Chara.physHealth[6]||this.Chara.physHealth[7]||this.Chara.physHealth[8]||this.Chara.physHealth[9]){
      if(!this.rules.deadCh.includes(this.charID)){
      this.rules.charaList=this.rules.charaList.filter(c=>c!=this.charID);
        this.rules.deadCh=[...this.rules.deadCh, this.charID]
        this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=this.charID);
        this.iconsNames.ordCharaList[7]=[...this.iconsNames.ordCharaList[7], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
      this.isdead=true
      this.rules.addRules();
      let [a, ...last4]=this.notifs.last5;
      if(this.userd.info.language=='en') this.notifs.last5=[...last4, this.Chara.fullName + ' has passed away...']
      else this.notifs.last5=[...last4, this.Chara.fullName + ' ha perso la vita...']
      this.notifs.addMessage(this.rules.gameID);
    }
    }
    else if(this.rules.deadCh.includes(this.charID)){
      this.rules.deadCh=this.rules.deadCh.filter(c=>c!=this.charID);
      this.rules.charaList=[...this.rules.charaList, this.charID];
        this.iconsNames.ordCharaList[7]=this.iconsNames.ordCharaList[7].filter(c=>c.id!=this.charID);
        ind=this.rules.depsList.indexOf(this.Chara.role[1]); //oldDep in caso è nuovo e per far funzionare Changedep
        if(this.Chara.role[1]==0) ind=6;
        this.iconsNames.ordCharaList[ind]=[...this.iconsNames.ordCharaList[ind], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}]
      this.isdead=false
      this.rules.addRules();
      let [a, ...last4]=this.notifs.last5;
      if(this.userd.info.language=='en') this.notifs.last5=[...last4, this.Chara.fullName + ' comes back to life!']
      else this.notifs.last5=[...last4, this.Chara.fullName + ' torna in vita!']
      this.notifs.addMessage(this.rules.gameID);
    }
this.addChara();
this.ref.markForCheck();
});
}
  async getChara(id:number): Promise<void> {
    const charRef = doc(this.db, 'charas/' + this.rules.gameID + '-' + id).withConverter(new CharaConverter());
    const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
    const uChara: Character = snapshot1.data()!;
    if (uChara) {
    this.Chara = uChara;
    this.charID=id;
    this.vexpUpdate(1);
    this.vexpUpdate(2);
    this.vexpUpdate(3);
    this.vexpUpdate(4);
    this.depAbsUp();
    this.depColorUp();
    this.isdead = this.rules.deadCh.includes(this.charID);
    this.checkownership().then((e)=>{
    this.ref.markForCheck();
    })
    }
  }
  async addChara() : Promise<void>{
    if(this.charID==0) return; //per evitare di sovrascrivere il char0 di default quando si preme salva senza aver caricato un char o creato un nuovo char con id diverso da 0
    const charRef = doc(this.db, 'charas/' + this.rules.gameID + '-' + this.charID).withConverter(new CharaConverter()); //(this.gameID*200) ?? ma non vaaaa
    await setDoc(charRef, this.Chara);
  }

  async checkownership(){
    if(this.rules.isDM) this.owns=true;
    else{
    for(let i=0; i<this.userd.info.characters.length;i++){
    let [game, findId]=this.userd.info.characters[i].split('-');
    if(Number(game)!=this.rules.gameID) continue;
    if(Number(findId)==this.charID) this.owns=true;
    break;
    }
        if(this.owns==false){
        for(let i=0; i<this.userd.info.characters.length;i++){
        let [game, findId]=this.userd.info.characters[i].split('-');
        if(Number(game)!=this.rules.gameID) continue;
        if(Number(findId)==this.charID) this.owns=true;
        break;
        }
      }
    }
  }

  depAbsUp(c: number=this.Chara.role[1]){
    switch(c){
      case 1: this.captAbs=this.rules.controlAbs;
      break;
      case 2: this.captAbs=this.rules.infoAbs;
      break;
      case 3: this.captAbs=this.rules.trainAbs;
      break;
      case 4: this.captAbs=this.rules.safetyAbs;
      break;
      case 5: this.captAbs=this.rules.centralAbs;
      break;
      case 6: this.captAbs=this.rules.discAbs;
      break;
      case 7: this.captAbs=this.rules.welfareAbs;
      break;
      case 8: this.captAbs=this.rules.extractAbs;
      break;
      case 9: this.captAbs=this.rules.recordsAbs;
      break;
      case 10: this.captAbs=this.rules.architAbs;
      break;
      default: this.captAbs=["---"];
    } //Con le Regole Custom per ogni partita confrontare nomi dalle regole, ex case Rules.deps[9] : var(--Custom1)
  }
  depColorUp(c: number=this.Chara.role[1]){
    this.depText="#010101";
    let newC=this.rules.depColorUp(c);
    if(newC[1])this.depText="aliceblue";
    this.depColor=newC[0] as string;
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
}
