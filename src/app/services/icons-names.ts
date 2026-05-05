import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { collection, query, where } from "firebase/firestore";
import { doc, getDoc, DocumentSnapshot, setDoc } from 'firebase/firestore';
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
  ordCharaList: {id: number, name: string, icon: string}[][] = [];
  ordAbnoList: {id: number, name: string, icon: string}[][] = [];
  constructor() {
    if(this.ordCharaList.length==0){
      this.makeList(false);
      this.addList(false);
    }
    if(this.ordAbnoList.length==0){
      this.makeList(true);
      this.addList(true);
    }
  }

  async addList(bool: boolean) : Promise<void>{
        const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());//(this.gameID*200) ?? ma non vaaaa
        let list=(new iconList((bool? this.ordAbnoList : this.ordCharaList)));
        console.log("List to save: ", list);
        await setDoc(listRef, list);
  }
  
  async getList(bool: boolean) : Promise<void>{
    const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());
        const snapshot1: DocumentSnapshot<iconList> = await getDoc(listRef);
        const list: iconList = snapshot1.data()!;
        if (list) {
          console.log("List obtained: ", list);
          if(bool) {
            if(list.dep1) this.ordAbnoList=[list.dep1];
            if(list.dep2) this.ordAbnoList=[...this.ordAbnoList, list.dep2];
            if(list.dep3) this.ordAbnoList=[...this.ordAbnoList, list.dep3];
            if(list.dep4) this.ordAbnoList=[...this.ordAbnoList, list.dep4];
            if(list.dep5) this.ordAbnoList=[...this.ordAbnoList, list.dep5];
            if(list.dep6) this.ordAbnoList=[...this.ordAbnoList, list.dep6];
            if(list.dep7) this.ordAbnoList=[...this.ordAbnoList, list.dep7];
            if(list.dep8) this.ordAbnoList=[...this.ordAbnoList, list.dep8];
        console.log("Finished List: ", this.ordAbnoList);
          }
          else {
            if(list.dep1) this.ordCharaList=[list.dep1];
            if(list.dep2) this.ordCharaList=[...this.ordCharaList, list.dep2];
            if(list.dep3) this.ordCharaList=[...this.ordCharaList, list.dep3];
            if(list.dep4) this.ordCharaList=[...this.ordCharaList, list.dep4];
            if(list.dep5) this.ordCharaList=[...this.ordCharaList, list.dep5];
            if(list.dep6) this.ordCharaList=[...this.ordCharaList, list.dep6];
            if(list.dep7) this.ordCharaList=[...this.ordCharaList, list.dep7];
            if(list.dep8) this.ordCharaList=[...this.ordCharaList, list.dep8];
        console.log("Finished List: ", this.ordCharaList);
          }
        }
  }

  makeList(type:boolean){
    let l= this.rules.depsList.length;
    if(type){
      this.ordAbnoList=Array(l).fill([]);
      for(let i=0; i<this.rules.abnoList.length; i++){
        let chara=this.getIcon(this.rules.abnoList[i], true)
        if(!chara)continue;
        chara.then((res)=>{
          if(res){
            let [ico, dep] = res;
          for(let j=0; j<l; j++){
            if(dep==this.rules.depsList[j]){
              if(!this.ordAbnoList[j])this.ordAbnoList[j]=[ico];
              else this.ordAbnoList[j]=[...this.ordAbnoList[j], ico];
            }
          }
        }
        }).catch((err)=>{console.log(err)});
      }
    return;
    }
    this.ordCharaList=Array(l+2).fill([]);
    for(let i=0; i<this.rules.charaList.length; i++){
      let ret=this.getIcon(this.rules.charaList[i], false)
      if(!ret)continue;
      ret.then((res)=>{
        if(res){
          let [chara, dep] = res;
        for(let j=0; j<l; j++){
          if(dep==this.rules.depsList[j]){
            if(!this.ordCharaList[j])this.ordCharaList[j]=[chara];
             else this.ordCharaList[j]=[...this.ordCharaList[j], chara];
          }
        }
        }
      }).catch((err)=>{console.log(err)});
    }
      l+=1;
    for(let i=0; i<this.rules.deadCh.length; i++){
        let ret=this.getIcon(this.rules.deadCh[i], false)
        if(!ret)continue;
        ret.then((res)=>{
          if(res){
            let [chara, dep] = res;
              if(!this.ordCharaList[l])this.ordCharaList[l]=[chara];
              else this.ordCharaList[l]=[...this.ordCharaList[l], chara];
          }
        }).catch((err)=>{console.log(err)});
    }
  }

 async getIcon(id: number, type: boolean) : Promise<[{id: number, name: string, icon: string}, number]|null>{
    if(!type){
          const charRef = doc(this.fireInit.db, 'charas/' + this.rules.gameID + '-' + id).withConverter(new CharaConverter()); //Icons a parte per leggere meno roba!
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          const uChara: Character = snapshot1.data()!;
          let res = { id: id, name: uChara.fullName, icon: uChara.icoUrl };
          return [res,uChara.role[1]];
    }
    if(type){
          const charRef = doc(this.fireInit.db, 'abnos/'+id).withConverter(new AbnoConverter());
          const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(charRef);
          const uChara: Abnormality = snapshot1.data()!;
          const charRef2 = doc(this.fireInit.db, 'gameabnos/'+this.rules.gameID + '-' + id).withConverter(new DataConverter());
          const snapshot2: DocumentSnapshot<AbnoData> = await getDoc(charRef2);
          const uData: AbnoData = snapshot2.data()!;
          let res = { id: id, name: uChara.fullName.Name, icon: uChara.icoUrl };
          return [res,uData.department];
    }
    return null;
  }
}


export class iconList{ //???? Non va???
    dep1?: {id: number, name: string, icon: string}[];
    dep2?: {id: number, name: string, icon: string}[];
    dep3?: {id: number, name: string, icon: string}[];
    dep4?: {id: number, name: string, icon: string}[];
    dep5?: {id: number, name: string, icon: string}[];
    dep6?: {id: number, name: string, icon: string}[];
    dep7?: {id: number, name: string, icon: string}[]; //massimo 6 dipartmenti ma serve per riserve e morti
    dep8?: {id: number, name: string, icon: string}[];
    constructor(list:{id: number, name: string, icon: string}[][]=[]) {
      let len=list.length;
      console.log("List to create: ", list);
      let newList: {id: number, name: string, icon: string}[][] = [];
      newList=list.slice();
      console.log("First item: ", list[0]);
      console.log("List length: ", len);
      console.log("New List: ", newList);
      switch(len){
        case 8: this.dep8=list[7];
        case 7: this.dep7=list[6];
        case 6: this.dep6=list[5];
        case 5: this.dep5=list[4];
        case 4: this.dep4=list[3];
        case 3: this.dep3=list[2];
        case 2: this.dep2=list[1];
        case 1: this.dep1=list[0];
        default: break;
      }
    }
}

interface iListFS{
    dep1?: {id: number, name: string, icon: string}[];
    dep2?: {id: number, name: string, icon: string}[];
    dep3?: {id: number, name: string, icon: string}[];
    dep4?: {id: number, name: string, icon: string}[];
    dep5?: {id: number, name: string, icon: string}[];
    dep6?: {id: number, name: string, icon: string}[];
    dep7?: {id: number, name: string, icon: string}[];
    dep8?: {id: number, name: string, icon: string}[];
}


export class listConverter implements FirestoreDataConverter<iconList, iListFS> {
  rules=inject(Sharedrules);
  toFirestore(icon: WithFieldValue<iconList>) : WithFieldValue<iListFS> {
    let res: WithFieldValue<iListFS> = {};
    let len=0;
    for(var prop in icon){
      if(icon[prop as keyof iconList]==undefined) continue;
      len++;
    }
    console.log("Lenght toFirestore: ", len);
    switch(len){
      case 8: (icon.dep8 ? res.dep8=icon.dep8 : res.dep8=[]);
      case 7: (icon.dep7 ? res.dep7=icon.dep7 : res.dep7=[]);
      case 6: (icon.dep6 ? res.dep6=icon.dep6 : res.dep6=[]);
      case 5: (icon.dep5 ? res.dep5=icon.dep5 : res.dep5=[]);
      case 4: (icon.dep4 ? res.dep4=icon.dep4 : res.dep4=[]);
      case 3: (icon.dep3 ? res.dep3=icon.dep3 : res.dep3=[]);
      case 2: (icon.dep2 ? res.dep2=icon.dep2 : res.dep2=[]);
      case 1: (icon.dep1 ? res.dep1=icon.dep1 : res.dep1=[]);
      default: break;
    }
    return res;
  }
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): iconList {
      const data = snapshot.data(options) as iListFS;
      let res = [ data.dep1 ?? [], data.dep2 ?? [], data.dep3 ?? [], data.dep4 ?? [], data.dep5 ?? [], data.dep6 ?? [], data.dep7 ?? [], data.dep8 ?? [] ];
      let l= this.rules.rules.depsList.length;
      if(res[6] || res[7])  {let newRes=[]
        for(let i=0; i<l; i++){
          newRes.push(res[i]);
        }
        newRes.push(res[6]);
        newRes.push(res[7]);
        res=newRes;
      }
      return new iconList(res);
  }
}