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
  this.getAbno(this.rules.lookFor);
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
    const charRef = doc(this.db, 'abnos/'+id).withConverter(new AbnoConverter());
    const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(charRef);
    const uChara: Abnormality = snapshot1.data()!;
    if (uChara) {
    this.AbnoSheet = uChara;
    this.dangerColorUp();
    this.getData();
    }
    console.log("thisAbnoSheet: ", this.AbnoSheet);
  }
  async getData(game:number=this.rules.gameID, id:number=this.rules.lookFor): Promise<void> {
    const charRef = doc(this.db, 'gameabnos/'+game+'-'+id).withConverter(new DataConverter());
    const snapshot1: DocumentSnapshot<AbnoData> = await getDoc(charRef);
    const uChara: AbnoData = snapshot1.data()!;
    if (uChara) {
    this.AbnoData = uChara;
    this.showname=(this.AbnoSheet.fullName.Nickname?this.AbnoData.trueNameRev:true);
    this.depColorUp();
    this.clockFill();
    this.ref.markForCheck();
    }
    console.log("thisAbnoData: ", this.AbnoData);
  }
  async addAbno(){
    if(this.AbnoSheet.abnoID==0) return;//ricordati di toglierlo per nuovi default
      const charRef = doc(this.db, 'abnos/'+this.AbnoSheet.abnoID).withConverter(new AbnoConverter());
      await setDoc(charRef, this.AbnoSheet);
      const snapshot1 = await getDoc(charRef);
      console.log("Abnormality saved: ", snapshot1.data());} //questo è il DB condiviso con le schede di base di partenza che non cambiano tra le partite

  async addData() {
    //if(this.AbnoData.gameID==0) return; //ricordati di toglierlo per nuovi default
      const charRef = doc(this.db, 'gameabnos/'+this.rules.gameID+'-'+this.AbnoSheet.abnoID).withConverter(new DataConverter());
      await setDoc(charRef, this.AbnoData);
      const snapshot1 = await getDoc(charRef);
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
