import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sharedrules {
  gameID:number = 0;
  //Invece di PlayerList meglio mettere gameID nell'account insieme alla lingua
  charaList:number[] = [1,2,3];//id personaggi
  abnoList:number[] = [0,1,2];//le Abno avranno una lista di base ma poi devono avere la exp memorizzata a parte quindi tanto vale avere una scheda nuova
  depsList:Departments[] = [Departments.Control, Departments.Information, Departments.Safety, Departments.Training, Departments.Disciplinary, Departments.Central, Departments.Custom1]; //ENUM
  bonusDeps:string[]=['Experimental'];
  bonusColors:[string,boolean][]=[['#6EFDD2', false]];//da usare per bonusDeps e customDeps, se si aggiungono altri bonusDeps o customDeps basta aggiungerli qui, bool è per testo bianco o nero
  capPassive=["Manager, Shut It Down!", "Solo Research", "Containment Protocols", "Shadow", "Rabbit Protocol"]
  controlAbs=["Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"]
  infoAbs=["Foresight","Respectful Distance","Don't Act Rashly","The Rationality to Maintain Discretion"]
  safetyAbs=["Dead Man Walking", "Bedside Manner", "Not On My Watch", "The Fearlessness to Keep On Living"]
  trainAbs=["Sink or Swim", "Right Out of the Handbook", "Stick to the Plan!", "The Hope to Be a Better Person"]
  discAbs=["Big EGO", "Pain Bringer", "Vitality", "The Courage to Protect"]
  centralAbs=["---"];
  welfareAbs=["---"];//serve almeno Welfare come reskin di Safety in futuro
  recordsAbs=["---"];
  extractAbs=["---"];
  architAbs=["---"];
  agentAbs=["Unassuming","Temporary Lucidity", "Face the Fear", "Virtuous", "Skilled"]
  traumas=["Cold","Haunted","Obsessed","Distrustful","Reckless","Soft","Volatile","Vicious"]
  traum3nabled=false; //per il progetto che dà un'altro slot se completato
  lookFor=0;
  constructor() { }
  //da salvare in una raccolta su Firebase e cambiarlo da un menù quindi serve comunque un componente ma cose come depsList e depColor() servono a tutti

  depColorUp(c: Departments){
    if(c<=10+this.bonusDeps.length){
    if(c>10) return [this.bonusColors[c-11][0], this.bonusColors[c-11][1]];
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