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
    isDM=false;
    AbnoSheet : Abnormality;
    AbnoData : AbnoData;
    abnoID=0;
    depColor:string;
    dangerColor:string;
    HTclocks: string[]=[];
    showname=false;
    dang= Danger;
  constructor(private ref: ChangeDetectorRef){
    this.AbnoSheet=new Abnormality();
    this.AbnoData=new AbnoData(); //Se non ha altri nomi inutile chiedere, meno rischi di sbagli per DM
    this.depColor="var(--Bonus)";
    this.dangerColor="var(--Bonus)";
  }

ngOnInit(){
  if(!this.getAbno(this.rules.lookFor)) this.abnoID=this.rules.lookFor;
  else{this.AbnoData.department=this.rules.lookDep; this.depColorUp();
    this.abnoID=(this.rules.abnoList.length+1);
    this.addAbno();
    this.addData();
  }
  console.log("AbnoData: ", this.AbnoData);
  const form = document.getElementById('abnoForm') as HTMLFormElement;
// Add submit event listener
  form.addEventListener('submit', async (event) => {

  // Prevent default form submission (page reload)
  event.preventDefault();

  // Rest of the logic (collect data, updatewiew)
  const formData = new FormData(form);

let inp;
inp=formData.get('AbnoName');
if(inp)this.AbnoSheet.fullName.Name=inp.toString();
console.log("Abno: ",formData.entries());

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
    console.log("thisAbnoSheet: ", this.AbnoSheet);
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
    console.log("thisAbnoData: ", this.AbnoData);
  }
  async addAbno() : Promise<void>{
    if(this.abnoID==0) return;//ricordati di toglierlo per nuovi default
      const abnoRef = doc(this.db, 'abnos/'+this.abnoID).withConverter(new AbnoConverter());
      await setDoc(abnoRef, this.AbnoSheet);
      const snapshot1 = await getDoc(abnoRef);
      console.log("Abnormality saved: ", snapshot1.data());} //questo è il DB condiviso con le schede di base di partenza che non cambiano tra le partite

  async addData() : Promise<void>{
    //if(this.AbnoData.gameID==0) return; //ricordati di toglierlo per nuovi default
      const abnoRef = doc(this.db, 'gameabnos/'+this.rules.gameID+'-'+this.abnoID).withConverter(new DataConverter());
      await setDoc(abnoRef, this.AbnoData);
      const snapshot1 = await getDoc(abnoRef);
      console.log("Data saved: ", snapshot1.data()); //questo è per aggiornare i dati in quella partita, quindi HP, posizione e ricerca
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
