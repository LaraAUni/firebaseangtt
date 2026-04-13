import { Injectable } from '@angular/core';
import { DocumentSnapshot, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import {Rules, RulesConverter} from './rules';
import { inject } from '@angular/core';
import { FireInit } from '../fire-init';

@Injectable({
  providedIn: 'root',
})
export class Sharedrules {
  rules=new Rules();
  lookFor=0;
  isDM=false;
  init=inject(FireInit);
  constructor() {}
  //da salvare in una raccolta su Firebase e cambiarlo da un menù quindi serve comunque un componente ma cose come depsList e depColor() servono a tutti

  async getRules(id:number): Promise<void> {
    const rulesRef = doc(this.init.db, 'rules/' + this.rules.gameID).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    const uRules: Rules = snapshot1.data()!;
    if (uRules) {
    this.rules = uRules;
    }
    console.log("Rules obtained: ", this.rules);
  }
  async addRules() : Promise<void>{
    if(this.rules.gameID==0) return; //per evitare di sovrascrivere il char0 di default quando si preme salva senza aver caricato un char o creato un nuovo char con id diverso da 0
    const rulesRef = doc(this.init.db, 'rules/' + this.rules.gameID).withConverter(new RulesConverter()); //(this.gameID*200) ?? ma non vaaaa
    await setDoc(rulesRef, this.rules);
    const snapshot1 = await getDoc(rulesRef);
    console.log("Rules saved: ", snapshot1.data());
  }

  async newGame(n:string){
    this.rules=new Rules();
    let i=1;
    const gameRef = doc(this.init.db, 'rules/' + i).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(gameRef);
    while(snapshot1.data()){
      i++;
      const gameRef = doc(this.init.db, 'rules/' + i).withConverter(new RulesConverter());
      const snapshot1: DocumentSnapshot<Rules> = await getDoc(gameRef);
    }
    this.rules.gameID=i;
    this.rules.gameName=n;
    this.addRules();
  }

  depColorUp(c: Departments){
    if(c<=10+this.rules.bonusDeps.length){
    if(c>10) return [this.rules.bonusColors[c-11][0], this.rules.bonusColors[c-11][1]];
    else if(c>0) if(c==8) return ["var(--Extraction)", true];
    return ["var(--"+Departments[c]+")", false];
  }
    return ["var(--Bonus)", false];
  } //Con le Regole Custom per ogni partita confrontare nomi extra dalle regole, exs case Rules.deps[9] : var(--customdep1)

  clockFiller(filled: number=0, max: number=3, color: string='red', background: string='dimgray'){
    let slice=100/max;
    return `conic-gradient(${color} 0 ${filled*slice}%, ${background} ${filled*slice}% 100%)`;
  }

  dangerColorUp(c: Danger){
    if(c>0 && c<6) return "var(--"+Danger[c]+")";
    return "var(--Bonus)";
  }

}

export enum Departments {
  Control=1,
  Information=2,
  Safety=3,
  Training=4,
  Disciplinary=5,
  Central=6,
  Welfare=7,
  Extraction=8,
  Records=9,
  Architecture=10,
  Custom1=11,
  Custom2=12,
  Custom3=13,
  Custom4=14,
  Custom5=15,
  Custom6=16,
  ''=0
}
export enum Danger {
  ZAYIN=1,
  TETH=2,
  HE=3,
  WAW=4,
  ALEPH=5
}