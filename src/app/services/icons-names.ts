import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { collection, query, where } from "firebase/firestore";
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { FireInit } from '../fire-init';
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from '../abno-sheet/abnoclass';
import { Character, CharaConverter } from '../chara-sheet/characlass';
import { Sharedrules } from './sharedrules';
import { WithFieldValue, QueryDocumentSnapshot, SnapshotOptions, FirestoreDataConverter } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})


export class IconsNames {
  fireInit = inject(FireInit);
  shRules = inject(Sharedrules);
  rules=this.shRules.rules;
  ordCharaList: IcoFS[][] = [];
  ordAbnoList: IcoFS[][] = [];
  constructor() {
    let l= this.rules.depsList.length;
    this.ordCharaList=Array(l+2).fill([]);
    for(let i=0; i<this.rules.charaList.length; i++){
      let chara=this.getIcon(this.rules.charaList[i], 1)
      if(!chara)continue;
      chara.then((res)=>{
        if(res){
        for(let j=0; j<l; j++){
          if(res.dep==this.rules.depsList[j]){
            console.log("Dep:",this.rules.depsList[j]);
            if(!this.ordCharaList[j])this.ordCharaList[j]=[res];
             else this.ordCharaList[j]=[...this.ordCharaList[j], res];
          }
        }
        }
      }).catch((err)=>{console.log(err)});
    }
    this.ordAbnoList=Array(l).fill([]);
        for(let j=0; j<l; j++){
    for(let i=0; i<this.rules.charaList.length; i++){
      let chara=this.getIcon(this.rules.charaList[i], 2)
      if(!chara)continue;
      chara.then((res)=>{
        if(res){
        for(let j=0; j<l; j++){
          if(res.dep==this.rules.depsList[j]){
            console.log("Dep:",this.rules.depsList[j]);
            if(!this.ordAbnoList[j])this.ordAbnoList[j]=[res];
             else this.ordAbnoList[j]=[...this.ordAbnoList[j], res];
          }
        }
      }
      }).catch((err)=>{console.log(err)});
    }
  }
  for(let r=0; r<1; r++){
  for(let i=0; i<this.rules.backupCh.length; i++){
        let chara=this.getIcon(this.rules.backupCh[i], 1)
        if(!chara)continue;
        chara.then((res)=>{
          if(res){
              if(!this.ordCharaList[l])this.ordCharaList[l]=[res];
              else this.ordCharaList[l]=[...this.ordCharaList[l], res];
          }
        }).catch((err)=>{console.log(err)});
        }
      l+=1;
  }
}
 async getIcon(id: number, type: number){
    let res: IcoFS = { id: 0, name: '', icon: '', dep: 0, HP: 0, maxHP: 0, physHealth: [] };
    if(type==1){
          const charRef = doc(this.fireInit.db, 'charas/' + this.rules.gameID + '-' + id).withConverter(new CharaConverter()); //Icons a parte per leggere meno roba!
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          const uChara: Character = snapshot1.data()!;
          res.id=id;
          res.name=uChara.fullName;
          res.icon=uChara.icoUrl;
          res.dep=uChara.role[1];
          res.physHealth=uChara.physHealth;
          return res;
    }
    if(type==2){
          const charRef = doc(this.fireInit.db, 'abnos/'+id).withConverter(new AbnoConverter());
          const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(charRef);
          const uChara: Abnormality = snapshot1.data()!;
          const charRef2 = doc(this.fireInit.db, 'gameabnos/'+this.rules.gameID+'-'+id).withConverter(new DataConverter());
          const snapshot2: DocumentSnapshot<AbnoData> = await getDoc(charRef2);
          const uData: AbnoData = snapshot2.data()!;
          res.id=id;
          res.name=uChara.fullName.Name;
          res.icon=uChara.icoUrl;
          res.dep=uData.department;
          res.HP=uData.suppProg;
          res.maxHP=uChara.suppClock;
          return res;
    }
    return null;
  }
}

export class Icon{
    id: number;
    name: string;
    icon: string;
    dep: number;
    HP: number;
    maxHP: number;
    physHealth : boolean[];
    constructor(id: number, name: string, icon: string, dep: number, HP: number, maxHP: number, physHealth: boolean[]){
        this.id=id;
        this.name=name;
        this.icon=icon;
        this.dep=dep;
        this.HP=HP;
        this.maxHP=maxHP;
        this.physHealth=physHealth;
    }
}

interface IcoFS{
    id: number;
    name: string;
    icon: string;
    dep: number;
    HP: number;
    maxHP: number;
    physHealth : boolean[];
}


export class IconConverter implements FirestoreDataConverter<Icon, IcoFS> {
  toFirestore(icon: WithFieldValue<Icon>) : WithFieldValue<IcoFS> {
    return {
        id: icon.id,
        name: icon.name,
        icon: icon.icon,
        dep: icon.dep,
        HP: icon.HP,
        maxHP: icon.maxHP,
        physHealth: icon.physHealth
    };
  }
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Icon {
      const data = snapshot.data(options) as IcoFS;
      return new Icon(data.id, data.name, data.icon, data.dep, data.HP, data.maxHP, data.physHealth);
  }
}