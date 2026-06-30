import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FireInit } from '../fire-init';
import { getDoc, setDoc, doc, DocumentSnapshot } from "firebase/firestore";
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from './abnoclass';
import { Sharedrules, Danger } from '../services/sharedrules';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { IconsNames } from '../services/icons-names';
import { Userinfo } from '../services/userinfo';

@Component({
  selector: 'app-abno-sheet',
  imports: [CommonModule],
  templateUrl: './abno-sheet.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './abno-sheet.css',
})
export class AbnoSheet {
  fireInit = inject(FireInit);
  rules= inject(Sharedrules);
  icons=inject(IconsNames);
  info=inject(Userinfo);
    app = this.fireInit.app;
    db = this.fireInit.db;
    lang='en';
    isDM=this.rules.isDM;
    owned=false;
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
    this.AbnoData=new AbnoData();
    this.depColor="var(--Bonus)";
    this.dangerColor="var(--Bonus)";
  }

async ngOnInit(){
  try{
    await this.getAbno(this.rules.lookFor);
    if(this.abnoID && !this.rules.abnoList.includes(this.abnoID)){
      this.rules.abnoList=[...this.rules.abnoList, this.abnoID];
      this.rules.addRules();
      this.AbnoData.department=this.rules.lookDep;
      this.depColorUp();
      this.addData();
      const i=this.rules.depsList.indexOf(this.AbnoData.department);
      const newname=(this.showname? (this.AbnoSheet.fullName.Nickname?this.AbnoSheet.fullName.Nickname:this.AbnoSheet.fullName.Name):'???')
      if(i>=0) this.icons.ordAbnoList[i]=[...this.icons.ordAbnoList[i], {id: this.abnoID, name: newname, icon: this.AbnoSheet.icoUrl}];
    }
    else{
    try{
    let res=await this.getData(); //Se non ha altri nomi inutile chiedere, meno rischi di sbagli per DM
    if(!res){
    this.AbnoData.department=this.rules.lookDep;
    this.depColorUp();
    this.ref.markForCheck();
    this.addData()}
    }catch(err){console.log(err)};
    }
  }catch(err){console.log(err);}
  
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
//  this.addAbno(); solo in casi speciali
});
}

  async getAbno(id:number): Promise<void> {
    const abnoRef = doc(this.db, 'abnos/'+id).withConverter(new AbnoConverter());
    const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(abnoRef);
    const uChara: Abnormality = snapshot1.data()!;
    if (uChara) {
    this.AbnoSheet = uChara;
    this.abnoID=id;
    if(this.AbnoSheet.dmID.includes(this.info.uid)) this.owned=true;
    this.dangerColorUp();
    }
  }

  async getData(game:number=this.rules.gameID, name:string=this.rules.name, id:number=this.rules.lookFor): Promise<boolean> {
    const abnoRef = doc(this.db, 'gameabnos/'+name+'-'+game+'-'+id).withConverter(new DataConverter());
    const snapshot1: DocumentSnapshot<AbnoData> = await getDoc(abnoRef);
    const uChara: AbnoData = snapshot1.data()!;
    if (uChara) {
    this.AbnoData = uChara;
    this.showname=(this.AbnoSheet.fullName.Nickname?this.AbnoData.trueNameRev:true); // se non ha un secondo nome è sempre vero, altrimenti la flag è truenamerevealed
    this.depColorUp();
    this.clockFill();
    this.ref.markForCheck();
    return true;
    }
    return false;
  }
  async addAbno() : Promise<void>{
    if(this.abnoID==0) return;//Toglierlo per cambiare default, ma meglio modificarli da Firebase
      const abnoRef = doc(this.db, 'abnos/'+this.abnoID).withConverter(new AbnoConverter());
      await setDoc(abnoRef, this.AbnoSheet);} //questo è il DB condiviso con le schede di base di partenza che non cambiano tra le partite

  async addData() : Promise<void>{
    if(this.rules.gameID==0) return;
      const abnoRef = doc(this.db, 'gameabnos/'+this.rules.name+'-'+this.rules.gameID+'-'+this.abnoID).withConverter(new DataConverter());
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
