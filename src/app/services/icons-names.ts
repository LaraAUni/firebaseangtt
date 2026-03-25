import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { collection, query, where } from "firebase/firestore";
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { FireInit } from '../fire-init';
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from '../abno-sheet/abnoclass';
import { Character, CharaConverter } from '../chara-sheet/characlass';
import { Sharedrules } from './sharedrules';

@Injectable({
  providedIn: 'root',
})


export class IconsNames {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  
  ordCharaList: CharObj[][] = []; //[[1,2,3],[1,2,3],[],[],[]]
  ordAbnoList: CharObj[][] = [];
  constructor() {
    this.ordCharaList=Array(this.rules.depsList.length).fill([]);
    for(let i=0; i<this.rules.charaList.length; i++){
      let chara=this.getIcon(this.rules.charaList[i], 1)
      if(!chara)continue;
      chara.then((res)=>{
        if(res){
        for(let j=0; j<this.rules.depsList.length; j++){
          if(res.dep==this.rules.depsList[j]){
            console.log("Dep:",this.rules.depsList[j]);
            if(!this.ordCharaList[j])this.ordCharaList[j]=[res];
             else this.ordCharaList[j]=[...this.ordCharaList[j], res];
          }
        }
        }
      }).catch((err)=>{console.log(err)});
    }
    console.log("CharaList: ", this.ordCharaList);
    this.ordAbnoList=Array(this.rules.depsList.length).fill([]);
    for(let i=0; i<this.rules.charaList.length; i++){
      let chara=this.getIcon(this.rules.charaList[i], 2)
      if(!chara)continue;
      chara.then((res)=>{
        if(res){
        for(let j=0; j<this.rules.depsList.length; j++){
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
 async getIcon(id: number, type: number){
    let res: CharObj = { id: 0, name: '', icon: '', dep: 0 };
    if(type==1){
          const charRef = doc(this.fireInit.db, 'charas/'+id).withConverter(new CharaConverter());
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          const uChara: Character = snapshot1.data()!;
          res.id=uChara.charID;
          res.name=uChara.fullName;
          res.icon=uChara.icoUrl;
          res.dep=uChara.role[1];
          return res;
    }
    if(type==2){
          const charRef = doc(this.fireInit.db, 'abnos/'+id).withConverter(new AbnoConverter());
          const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(charRef);
          const uChara: Abnormality = snapshot1.data()!;
          const charRef2 = doc(this.fireInit.db, 'gameabnos/'+this.rules.gameID+'-'+id).withConverter(new DataConverter());
          const snapshot2: DocumentSnapshot<AbnoData> = await getDoc(charRef2);
          const uData: AbnoData = snapshot2.data()!;
          res.id=uChara.abnoID;
          res.name=uChara.fullName.Name;
          res.icon=uChara.icoUrl;
          res.dep=uData.department;
          return res;
    }
    return null;
  }
}

export interface CharObj {
  id: number;
  name: string;
  icon: string;
  dep: number;
}