import { Component, inject } from '@angular/core';
import { FireInit } from '../fire-init';
import { getDoc, setDoc, doc, DocumentSnapshot } from "firebase/firestore";
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from './abnoclass';
import { Sharedrules, Danger } from '../services/sharedrules';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-abno-sheet',
  imports: [CommonModule],
  templateUrl: './abno-sheet.html',
  styleUrl: './abno-sheet.css',
})
export class AbnoSheet {
  fireInit = inject(FireInit);
  rules= inject(Sharedrules);
    app = this.fireInit.app;
    db = this.fireInit.db;
    lang='en';
    isDM=this.rules.isDM;
    AbnoSheet : Abnormality;
    AbnoData : AbnoData;
    abnoID=0;
    depColor:string;
    dangerColor:string;
    HTclocks: string[]=[];
    showname=false; //mettere AbnoSelect in Name alla creazione
    dang= Danger;
  constructor(private ref: ChangeDetectorRef){
    this.AbnoSheet=new Abnormality();
    this.AbnoData=new AbnoData(); //Se non ha altri nomi inutile chiedere, meno rischi di sbagli per DM
    this.depColor="var(--Bonus)";
    this.dangerColor="var(--Bonus)";
    this.AbnoData.department=1;
    this.addData();
  }

ngOnInit(){
  if(!this.getAbno(this.rules.lookFor)) this.abnoID=this.rules.lookFor;
  else{this.AbnoData.department=this.rules.lookDep; this.depColorUp();
    //Funzione per nuove Abno wip, ma avrà un selettore per quelle esistenti
  }
  const form = document.getElementById('abnoForm') as HTMLFormElement;
// Add submit event listener
  form.addEventListener('submit', async (event) => {

  // Prevent default form submission (page reload)
  event.preventDefault();

  // Rest of the logic (collect data, updatewiew)
const formData = new FormData(form);

if(!this.isDM) return;

let inp;
inp=formData.get('AbnoName');
if(inp)this.AbnoSheet.fullName.Name=inp.toString();


this.ref.markForCheck();
this.addData();
this.addAbno();
});
}

  async getAbno(id:number): Promise<void> {
    const abnoRef = doc(this.db, 'abnos/'+id).withConverter(new AbnoConverter());
    const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(abnoRef);
    const uChara: Abnormality = snapshot1.data()!;
    if (uChara) {
    this.AbnoSheet = uChara;
    this.abnoID=id;
    this.dangerColorUp();
    this.getData();
    }
  }

  async getData(game:number=this.rules.gameID, id:number=this.rules.lookFor): Promise<void> {
    const abnoRef = doc(this.db, 'gameabnos/'+game+'-'+id).withConverter(new DataConverter());
    const snapshot1: DocumentSnapshot<AbnoData> = await getDoc(abnoRef);
    const uChara: AbnoData = snapshot1.data()!;
    if (uChara) {
    this.AbnoData = uChara;
    this.showname=(this.AbnoSheet.fullName.Nickname?this.AbnoData.trueNameRev:true); // se non ha un secondo nome è sempre vero, altrimenti la flag è truenamerevealed
    this.depColorUp();
    this.clockFill();
    this.ref.markForCheck();
    }
  }
  async addAbno() : Promise<void>{
    if(this.abnoID==0) return;//Toglierlo per cambiare default, ma meglio modificarli da Firebase
      const abnoRef = doc(this.db, 'abnos/'+this.abnoID).withConverter(new AbnoConverter());
      await setDoc(abnoRef, this.AbnoSheet);} //questo è il DB condiviso con le schede di base di partenza che non cambiano tra le partite

  async addData() : Promise<void>{
    if(this.rules.gameID==0) return;
      const abnoRef = doc(this.db, 'gameabnos/'+this.rules.gameID+'-'+this.abnoID).withConverter(new DataConverter());
      await setDoc(abnoRef, this.AbnoData); //questo è per aggiornare i dati in quella partita, quindi HP, posizione e ricerca
}
  depColorUp(c: number=this.AbnoData.department){
    let newC=this.rules.depColorUp(c);
    this.depColor=newC[0] as string;
  }
  dangerColorUp(){
    this.dangerColor=this.rules.dangerColorUp(this.AbnoSheet.danger);
  }
  clockFill(){
    this.HTclocks[0]=this.rules.clockFiller(this.AbnoData.suppProg, this.AbnoSheet.suppClock);
    for(let i=0; i<this.AbnoSheet.trials.length; i++){this.HTclocks[i+1]=this.rules.clockFiller(this.AbnoData.trialClock[i], this.AbnoSheet.trials[i].Clock,'dodgerblue');}
  }
}
