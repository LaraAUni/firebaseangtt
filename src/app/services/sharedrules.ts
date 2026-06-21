import { Injectable } from '@angular/core';
import { DocumentSnapshot, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Rules, RulesConverter } from '../rules';
import { inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { Userinfo } from './userinfo';

@Injectable({
  providedIn: 'root',
})
export class Sharedrules {
  gameID: number = 0;
  DMIds: string[] = [];  //Meglio mettere gameID nell'account insieme alla lingua per cercarli, ma serve permesso da DM
  playerIDs: string[]=[];
  charaList: number[] = [];//id personaggi
  deadCh: number[] = [];
  abnoList: number[] = [];//le Abno avranno una lista di base ma poi devono avere la exp memorizzata a parte quindi tanto vale avere una scheda nuova
  depsList: Departments[] = []; //ENUM
  bonusDeps: string[] = [];
  bonusColors: [string, boolean][] = [];//da usare per bonusDeps e customDeps, se si aggiungono altri bonusDeps o customDeps basta aggiungerli qui, bool è per testo bianco o nero
  capPassive: string[] =["Manager, Shut It Down!", "Solo Research", "Containment Protocols", "Shadow", "Rabbit Protocol","---","---","---","---","---","---","---","---","---","---","---"];
  controlAbs: string[] =["Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"];
  infoAbs: string[] = ["Foresight","Respectful Distance","Don't Act Rashly","The Rationality to Maintain Discretion"];
  safetyAbs: string[] = ["Dead Man Walking", "Bedside Manners", "Not On My Watch", "The Fearlessness to Keep On Living"];
  trainAbs: string[] = ["Sink or Swim", "Right Out of the Handbook", "Stick to the Plan!", "The Hope to Be a Better Person"];
  discAbs: string[] = ["Big EGO", "Pain Bringer", "Vitality", "The Courage to Protect"];
  centralAbs: string[] = ["Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"]; //reskin di Control
  welfareAbs: string[] = ["Dead Man Walking", "Bedside Manners", "Not On My Watch", "The Fearlessness to Keep On Living"]; //Al momento è solo per reskin di Safety
  recordsAbs: string[] = [];
  extractAbs: string[] = [];
  architAbs: string[] = [];
  bonus1Abs: string[] = [];
  bonus2Abs: string[] = [];
  bonus3Abs: string[] = [];
  bonus4Abs: string[] = [];
  bonus5Abs: string[] = [];
  bonus6Abs: string[] = [];
  agentAbs: string[] = ["Unassuming","Temporary Lucidity", "Face the Fear", "Virtuous", "Skilled"];
  traumas: string[] = ["Cold","Haunted","Obsessed","Distrustful","Reckless","Soft","Volatile","Vicious"];
  traum3nabled = false; //per il progetto che dà un'altro slot se completato
  lookFor = 0;
  lookDep = 0;
  isDM = false;
  name = '';
  init = inject(FireInit);
  info= inject(Userinfo)

  constructor() {
  }

  //da salvare in una raccolta su Firebase e cambiarlo da un menù quindi serve comunque un componente ma cose come depsList e depColor() servono a tutti

  async getRules(date: number, name: string=this.name): Promise<boolean> {
    let uRules: Rules;
    this.name=name;
    this.gameID=date;
    if(date){const rulesRef = doc(this.init.db, 'rules/' + name + '-' + date).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    if(snapshot1.data()!=undefined){
    uRules = snapshot1.data()!;
    }
    else return false;
    ;
    }
    else return false;
    if (uRules) {
      this.DMIds = uRules.DMIds;
      this.playerIDs=uRules.playerIDs;
      this.charaList = uRules.charaList;
      this.deadCh = uRules.deadCh;
      this.abnoList = uRules.abnoList;
      this.depsList = uRules.depsList;
      this.bonusDeps = uRules.bonusDeps;
      this.bonusColors = uRules.bonusColors;
      this.capPassive = uRules.capPassive;
      this.controlAbs = uRules.controlAbs;
      this.infoAbs = uRules.infoAbs;
      this.safetyAbs = uRules.safetyAbs;
      this.trainAbs = uRules.trainAbs;
      this.discAbs = uRules.discAbs;
      this.centralAbs = uRules.centralAbs;
      this.welfareAbs = uRules.welfareAbs;
      this.recordsAbs = uRules.recordsAbs;
      this.extractAbs = uRules.extractAbs;
      this.architAbs = uRules.architAbs;
      this.bonus1Abs = uRules.bonus1Abs;
      this.bonus2Abs = uRules.bonus2Abs;
      this.bonus3Abs = uRules.bonus3Abs;
      this.bonus4Abs = uRules.bonus4Abs;
      this.bonus5Abs = uRules.bonus5Abs;
      this.bonus6Abs = uRules.bonus6Abs;
      this.agentAbs = uRules.agentAbs;
      this.traumas = uRules.traumas;
      this.traum3nabled = uRules.traum3nabled;
    }
    this.isDM=this.DMIds.includes(this.info.id);
    return true;
  }
  
  

  async addRules(name: string=this.name, date: number=this.gameID): Promise<void> {
    if(date==0) return;
    const rulesRef = doc(this.init.db, 'rules/'  + name + '-' + date).withConverter(new RulesConverter()); //(this.gameID*200) ?? ma non vaaaa
    await setDoc(rulesRef, new Rules(this.DMIds, this.playerIDs, this.charaList, this.deadCh, this.abnoList, this.depsList, this.bonusDeps, this.bonusColors, this.capPassive, this.controlAbs, this.infoAbs, this.safetyAbs, this.trainAbs, this.discAbs, this.centralAbs, this.welfareAbs, this.recordsAbs, this.extractAbs, this.architAbs, this.bonus1Abs, this.bonus2Abs, this.bonus3Abs, this.bonus4Abs, this.bonus5Abs, this.bonus6Abs, this.agentAbs, this.traumas, this.traum3nabled));
  }

  async deleteRules(date:number, name:string): Promise<void> {
    const rulesRef = doc(this.init.db, 'rules/' + name + '-' + date).withConverter(new RulesConverter());
    deleteDoc(rulesRef);
  }

  async newGame(n: string, date: number): Promise<void> {
      if(date==0) return;
      const rulesRef = doc(this.init.db, 'rules/'  + n + '-' + date).withConverter(new RulesConverter()); //(this.gameID*200) ?? ma non vaaaa
      await setDoc(rulesRef, new Rules([this.info.id]));
  }

  depColorUp(c: Departments) {
    if (c <= 10 + this.bonusDeps.length && c>0) {
      if (c > 10){ if(this.bonusColors.length > c - 11) return [this.bonusColors[c - 11][0], this.bonusColors[c - 11][1]]
        else return ["var(--Bonus)", false];
      }
      else if (c > 0){ if (c == 8) return ["var(--Extraction)", true];
        else if(c==2) return ["var(--Information)", true];
      else if(c==7) return ["var(--Welfare)", true];}
      return ["var(--" + Departments[c] + ")", false];
    }
    return ["var(--Bonus)", false];
  } //Con le Regole Custom per ogni partita confrontare nomi extra dalle regole, exs case Rules.deps[9] : var(--customdep1)

  clockFiller(filled: number = 0, max: number = 3, color: string = 'red', background: string = 'dimgray') {
    let slice = 100 / max; //calcolo quanto dall'orologio è riempito e per i quadranti uso uno sprite che li divide
    return `conic-gradient(${color} 0 ${filled * slice}%, ${background} ${filled * slice}% 100%)`;
  }
  
  dangerColorUp(c: Danger) {
    if (c > 0 && c < 6) return "var(--" + Danger[c] + ")";
    return "var(--Bonus)";
  }

}

export enum Departments {
  None=0,
  Control = 1,
  Information = 2,
  Safety = 3,
  Training = 4,
  Disciplinary = 5,
  Central = 6,
  Welfare = 7,
  Extraction = 8,
  Records = 9,
  Architecture = 10,
  Custom1 = 11,
  Custom2 = 12,
  Custom3 = 13,
  Custom4 = 14,
  Custom5 = 15,
  Custom6 = 16
}
export enum Danger {
  ZAYIN = 1,
  TETH = 2,
  HE = 3,
  WAW = 4,
  ALEPH = 5
}