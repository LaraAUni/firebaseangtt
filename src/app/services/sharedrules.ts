import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sharedrules {
  gameID:number = 0;
  //PlayerList? Id account? Meglio mettere gameID nell'account insieme alla lingua
  charaList:number[] = [];//id personaggi
  depsList=["Control", "Information", "Safety", "Training", "Disciplinary"]
  controlAbs=["Manager, Shut It Down!", "Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"]
  infoAbs=["Solo Research","Foresight","Respectful Distance","Don't Act Rashly","The Rationality to Maintain Discretion"]
  safetyAbs=["Containment Protocols", "Dead Man Walking", "Bedside Manner", "Not On My Watch", "The Fearlessness to Keep On Living"]
  trainAbs=["Shadow", "Sink or Swim", "Right Out of the Handbook", "Stick to the Plan!", "The Hope to Be a Better Person"]
  discAbs=["Rabbit Protocol", "Big EGO", "Pain Bringer", "Vitality", "The Courage to Protect"]
  centralAbs=["---"];
  welfareAbs=["---"];//serve almeno Welfare come reskin di Safety in futuro
  recordsAbs=["---"];
  extractAbs=["---"];
  agentAbs=["Unassuming","Temporary Lucidity", "Face the Fear", "Virtuous", "Skilled"]
  traumas=["Cold","Haunted","Obsessed","Distrustful","Reckless","Soft","Volatile","Vicious"]
  traum3nabled=false;
  constructor() { }
  //da salvare in una raccolta su Firebase e cabiarlo da un menù quindi serve comunque un componente ma cose come depsList e depColor() servono a tutti
  
  depColorUp(c: string=''){
    switch(c){
      case "Control":  return ["var(--control-color)", false]; //false-> se serve testo bianco, così si può mettere anche per customdep
      case "Information":  return ["var(--info-color)", false];
      case "Training":  return ["var(--training-color)", false];
      case "Safety":  return ["var(--safety-color)", false];
      case "Central-Command":  return ["var(--central-color)", false];
      case "Disciplinary":  return ["var(--disc-color)", false];
      case "Welfare":  return ["var(--welfare-color)", false];
      case "Extraction":return ["var(--extraction-color)", true];
      case "Records":  return ["var(--records-color)", false];
      default:  return ["var(--bonusdep-color)", false];
    } //Con le Regole Custom per ogni partita confrontare nomi extra dalle regole, exs case Rules.deps[9] : var(--customdep1-color)
  }
}
