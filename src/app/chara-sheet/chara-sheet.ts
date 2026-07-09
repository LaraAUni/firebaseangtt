import { ChangeDetectorRef, Component, inject, ChangeDetectionStrategy } from '@angular/core';
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
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-chara-sheet',
  imports: [CommonModule, RouterOutlet, NgTemplateOutlet, FormsModule],
  templateUrl: './chara-sheet.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './chara-sheet.css',
})


export class CharaSheet {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  iconsNames = inject(IconsNames);
  info=inject(Userinfo);
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
  depText="var(--darkbackg)";
  depChange=false;
  oldDep=0;
  new=false;
  owns=false;
  fullName='';
constructor(private ref: ChangeDetectorRef){
  this.Chara = new Character();
}

ngOnInit(){
  if(this.rules.lookFor){this.charID=this.rules.lookFor; this.getChara(this.charID);}
  else{this.Chara.role[1]=this.rules.lookDep; this.depColorUp();
    this.owns=true;
    let maxA:number;
    if(this.rules.charaList.length) maxA=Math.max(...this.rules.charaList);
    else  maxA=0;
    let maxD:number;
    if(this.rules.deadCh.length) maxD=Math.max(...this.rules.deadCh);
    else  maxD=0;
    this.charID=(maxA>maxD?maxA+1:maxD+1);
    this.new=true;
    this.rules.lookFor=this.charID;
    this.oldDep=this.Chara.role[1];
  }
}
  async getChara(id:number, name:string=this.rules.name, gameID:number=this.rules.gameID): Promise<void> {
    const charRef = doc(this.db, 'charas/' + name + '-' + gameID + '-' + id).withConverter(new CharaConverter());
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
    this.oldDep=this.Chara.role[1];
    try{
      await this.checkownership();
      this.ref.markForCheck();
    }catch(err){console.log(err)};
    }
  }
  async addChara( name:string=this.rules.name, gameID:number=this.rules.gameID) : Promise<void>{
    if(this.charID==0) return; //per evitare di sovrascrivere il char0 di default quando si preme salva senza aver caricato un char o creato un nuovo char con id diverso da 0
    const charRef = doc(this.db, 'charas/' + name + '-' + gameID + '-' + this.charID).withConverter(new CharaConverter()); //(this.gameID*200) ?? ma non vaaaa
    await setDoc(charRef, this.Chara);
  }

    async onCharaFormSubmit(f:NgForm): Promise<void> {
    // leggere i valori dal form usando le proprietà del componente
    let ind=6; //Dep=0 è riserva, non fa parte di depsList quindi è default
    if(this.isdead) ind=7;
    else if(this.oldDep!=0) ind=this.rules.depsList.indexOf(this.oldDep); //basato su oldDep per far funzionare Changedep

    if(this.new){
      ind=this.rules.depsList.indexOf(this.Chara.role[1]);
      if(this.Chara.role[1]==0) ind=6
      this.rules.charaList=[...this.rules.charaList, this.charID];
      this.iconsNames.ordCharaList[ind]=[...this.iconsNames.ordCharaList[ind], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
      this.new=false;
      this.info.characters=[...this.info.characters, this.rules.name + '-' + this.rules.gameID + '-' + this.charID];
      await this.info.addUser();
      await this.rules.addRules();
    } else{
    let charIndex = this.iconsNames.ordCharaList[ind].findIndex(c => c.id === this.charID); //aggiornare subito il nome per evitare che si perda negli altri casi speciali
    if(charIndex!=-1) this.iconsNames.ordCharaList[ind][charIndex].name=this.Chara.fullName;
    
    if(this.depChange){
      if(this.oldDep!=this.Chara.role[1]){
      let newind=this.rules.depsList.indexOf(this.Chara.role[1]); //se Select viene selezionato ma rimesso uguale od è nuovo saltare
      if(!this.isdead){ //non serve aggiornare Dead ma il dipartimento sì in caso Dead si aggiorna al prossimo step
      if(newind==-1) newind=6;
      this.iconsNames.ordCharaList[newind]=[...this.iconsNames.ordCharaList[newind], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
      this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=this.charID); //se era in riserva si deve togliere dalla lista di riserva
      this.depChange=false;
      this.oldDep=this.Chara.role[1];
    }
      ind=newind;
  }
  this.depAbsUp();
  this.depColorUp();
  await this.iconsNames.addList(false);
  }
  }
      if(this.Chara.physHealth[5]||this.Chara.physHealth[6]||this.Chara.physHealth[7]||this.Chara.physHealth[8]||this.Chara.physHealth[9]){
        if(!this.rules.deadCh.includes(this.charID)){
        this.rules.charaList=this.rules.charaList.filter(c=>c!=this.charID);
          this.rules.deadCh=[...this.rules.deadCh, this.charID]
          this.iconsNames.ordCharaList[ind]=this.iconsNames.ordCharaList[ind].filter(c=>c.id!=this.charID);
          this.iconsNames.ordCharaList[7]=[...this.iconsNames.ordCharaList[7], {id: this.charID, name: this.Chara.fullName, icon: this.Chara.icoUrl}];
        this.isdead=true
        await this.rules.addRules();
        let [a, ...last4]=this.notifs.last5;
        if(this.info.language=='en') this.notifs.last5=[...last4, this.Chara.fullName + ' has passed away...']
        else this.notifs.last5=[...last4, this.Chara.fullName + ' ha perso la vita...']
        await this.notifs.addMessage(this.rules.gameID);
        await this.iconsNames.addList(true);
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
        await this.rules.addRules();
        let [a, ...last4]=this.notifs.last5;
        if(this.info.language=='en') this.notifs.last5=[...last4, this.Chara.fullName + ' comes back to life!']
        else this.notifs.last5=[...last4, this.Chara.fullName + ' torna in vita!']
        await this.notifs.addMessage(this.rules.gameID);
        await this.iconsNames.addList(true);
      }

      if(f.value.stress>=1 && ( f.value.stress<=6) || (this.Chara.role[0]=='Captain' && f.value.stress<=8) ) this.Chara.stress=f.value.stress;
      else if(f.value.stress==0) this.Chara.stress=0;

      if(f.value.exp>=1 && f.value.exp<=6) this.Chara.exp[0]=f.value.exp;
      else if(f.value.exp==0) this.Chara.exp[0]=0;
      if(f.value.exp1>=1 && f.value.exp1<=6) this.Chara.exp[1]=f.value.exp1;
      else if(f.value.exp1==0) this.Chara.exp[1]=0;
      if(f.value.exp2>=1 && f.value.exp2<=6) this.Chara.exp[2]=f.value.exp2;
      else if(f.value.exp2==0) this.Chara.exp[2]=0;
      if(f.value.exp3>=1 && f.value.exp3<=6) this.Chara.exp[3]=f.value.exp3;
      else if(f.value.exp3==0) this.Chara.exp[3]=0;
      if(f.value.exp4>=1 && f.value.exp4<=6) this.Chara.exp[4]=f.value.exp4;
      else if(f.value.exp4==0) this.Chara.exp[4]=0;
      
      if(f.value.Excel>=1 && f.value.Excel<=4) this.Chara.skills[0]=f.value.Excel;
      else if(f.value.Excel==0) this.Chara.skills[0]=0;
      if(f.value.Endure>=1 && f.value.Endure<=4) this.Chara.skills[1]=f.value.Endure;
      else if(f.value.Endure==0) this.Chara.skills[1]=0;
      if(f.value.Lurk>=1 && f.value.Lurk<=4) this.Chara.skills[2]=f.value.Lurk;
      else if(f.value.Lurk==0) this.Chara.skills[2]=0;
      if(f.value.Rush>=1 && f.value.Rush<=4) this.Chara.skills[3]=f.value.Rush;
      else if(f.value.Rush==0) this.Chara.skills[3]=0;
      if(f.value.Observe>=1 && f.value.Observe<=4) this.Chara.skills[4]=f.value.Observe;
      else if(f.value.Observe==0) this.Chara.skills[4]=0;
      if(f.value.Consort>=1 && f.value.Consort<=4) this.Chara.skills[5]=f.value.Consort;
      else if(f.value.Consort==0) this.Chara.skills[5]=0;
      if(f.value.Hunt>=1 && f.value.Hunt<=4) this.Chara.skills[6]=f.value.Hunt;
      else if(f.value.Hunt==0) this.Chara.skills[6]=0;
      if(f.value.Operate>=1 && f.value.Operate<=4) this.Chara.skills[7]=f.value.Operate;
      else if(f.value.Operate==0) this.Chara.skills[7]=0;
      if(f.value.Command>=1 && f.value.Command<=4) this.Chara.skills[8]=f.value.Command;
      else if(f.value.Command==0) this.Chara.skills[8]=0;
      if(f.value.Skirmish>=1 && f.value.Skirmish<=4) this.Chara.skills[9]=f.value.Skirmish;
      else if(f.value.Skirmish==0) this.Chara.skills[9]=0;

      this.vexpUpdate(1);
      this.vexpUpdate(2);
      this.vexpUpdate(3);
      this.vexpUpdate(4);
      await this.addChara();
      this.ref.markForCheck();
  }

  async checkownership(){
    if(this.rules.isDM){ this.owns=true;
      return;
    }
    else{
    for(let i=0; i<this.info.characters.length;i++){
    let [name ,game, findId]=this.info.characters[i].split('-');
    if(name!=this.rules.name) continue;
    if(Number(game)!=this.rules.gameID) continue;
    if(Number(findId)==this.charID){ this.owns=true; return;}
    }
    for(let i=0; i<this.info.borrow.length;i++){
    let [name ,game, findId]=this.info.borrow[i].split('-');
    if(name!=this.rules.name) continue;
    if(Number(game)!=this.rules.gameID) continue;
    if(Number(findId)==this.charID){ this.owns=true; return;}
    }
    }
    this.owns=false;
  }

  depAbsUp(c: number=this.Chara.role[1]){
    switch(c){
      case 1: this.captAbs=this.rules.controlAbs;
      break;
      case 2: this.captAbs=this.rules.infoAbs;
      break;
      case 3: this.captAbs=this.rules.safetyAbs;
      break;
      case 4: this.captAbs=this.rules.trainAbs;
      break;
      case 5: this.captAbs=this.rules.discAbs;
      break;
      case 6: this.captAbs=this.rules.centralAbs;
      break;
      case 7: this.captAbs=this.rules.welfareAbs;
      break;
      case 8: this.captAbs=this.rules.extractAbs;
      break;
      case 9: this.captAbs=this.rules.recordsAbs;
      break;
      case 10: this.captAbs=this.rules.architAbs;
      break;
      case 11: this.captAbs=this.rules.bonus1Abs;
      break;
      case 12: this.captAbs=this.rules.bonus2Abs;
      break;
      case 13: this.captAbs=this.rules.bonus3Abs;
      break;
      case 14: this.captAbs=this.rules.bonus4Abs;
      break;
      case 15: this.captAbs=this.rules.bonus5Abs;
      break;
      case 16: this.captAbs=this.rules.bonus6Abs;
      break;
      default: this.captAbs=["---"];
    } //Con le Regole Custom per ogni partita confrontare nomi dalle regole, ex case Rules.deps[9] : var(--Custom1)
  }
  depColorUp(c: number=this.Chara.role[1]){
    this.depText="var(--darkbackg)";
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
