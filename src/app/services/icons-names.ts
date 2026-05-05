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
  ordCharaList: iconList = new iconList();
  ordAbnoList: iconList = new iconList();
  constructor() {
      this.makeList(false);
      this.makeList(true);
  }

  async addList(bool: boolean) : Promise<void>{
        const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());//(this.gameID*200) ?? ma non vaaaa
        await setDoc(listRef, (bool?this.ordAbnoList:this.ordCharaList));
  }
  
  async getList(bool: boolean) : Promise<void>{
    const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());
        const snapshot1: DocumentSnapshot<iconList> = await getDoc(listRef);
        const list: iconList = snapshot1.data()!;
        if (list) {
          console.log("List obtained: ", list);
          if(bool) {

        console.log("Finished List: ", this.ordAbnoList);
          }
          else {

        console.log("Finished List: ", this.ordCharaList);
          }
        }
  }

  makeList(type:boolean){
    let l= this.rules.depsList.length;
    if(type){
      for(let i=0; i<this.rules.abnoList.length; i++){
        let ret=this.getIcon(this.rules.abnoList[i], true)
        if(!ret)continue;
        ret.then((res)=>{
          if(res){
            let [chara, dep] = res;
          for(let j=0; j<l; j++){
            if(dep==this.rules.depsList[j]){
            switch(j){
              case 0: if(this.ordAbnoList.dep1)this.ordAbnoList.dep1=[...this.ordAbnoList.dep1, chara]; break;
              case 1: if(this.ordAbnoList.dep2)this.ordAbnoList.dep2=[...this.ordAbnoList.dep2, chara]; break;
              case 2: if(this.ordAbnoList.dep3)this.ordAbnoList.dep3=[...this.ordAbnoList.dep3, chara]; break;
              case 3: if(this.ordAbnoList.dep4)this.ordAbnoList.dep4=[...this.ordAbnoList.dep4, chara]; break;
              case 4: if(this.ordAbnoList.dep5)this.ordAbnoList.dep5=[...this.ordAbnoList.dep5, chara]; break;
              case 5: if(this.ordAbnoList.dep6)this.ordAbnoList.dep6=[...this.ordAbnoList.dep6, chara]; break;
              default: break;
            }
            switch(j){
              case 0: if(!this.ordAbnoList.dep1)this.ordAbnoList.dep1=[chara]; break;
              case 1: if(!this.ordAbnoList.dep2)this.ordAbnoList.dep2=[chara]; break;
              case 2: if(!this.ordAbnoList.dep3)this.ordAbnoList.dep3=[chara]; break;
              case 3: if(!this.ordAbnoList.dep4)this.ordAbnoList.dep4=[chara]; break;
              case 4: if(!this.ordAbnoList.dep5)this.ordAbnoList.dep5=[chara]; break;
              case 5: if(!this.ordAbnoList.dep6)this.ordAbnoList.dep6=[chara]; break;
              default: break;
            }
            }
          }
        }
        }).catch((err)=>{console.log(err)});
      }
    return;
    }
    for(let i=0; i<this.rules.charaList.length; i++){
      let ret=this.getIcon(this.rules.charaList[i], false)
      if(!ret)continue;
      ret.then((res)=>{
        if(res){
          let [chara, dep] = res;
        for(let j=0; j<l; j++){
          if(dep==this.rules.depsList[j]){
            switch(j){
              case 0: if(this.ordCharaList.dep1)this.ordCharaList.dep1=[...this.ordCharaList.dep1, chara]; break;
              case 1: if(this.ordCharaList.dep2)this.ordCharaList.dep2=[...this.ordCharaList.dep2, chara]; break;
              case 2: if(this.ordCharaList.dep3)this.ordCharaList.dep3=[...this.ordCharaList.dep3, chara]; break;
              case 3: if(this.ordCharaList.dep4)this.ordCharaList.dep4=[...this.ordCharaList.dep4, chara]; break;
              case 4: if(this.ordCharaList.dep5)this.ordCharaList.dep5=[...this.ordCharaList.dep5, chara]; break;
              case 5: if(this.ordCharaList.dep6)this.ordCharaList.dep6=[...this.ordCharaList.dep6, chara]; break;
              default: break;
            }
            switch(j){
              case 0: if(!this.ordCharaList.dep1)this.ordCharaList.dep1=[chara]; break;
              case 1: if(!this.ordCharaList.dep2)this.ordCharaList.dep2=[chara]; break;
              case 2: if(!this.ordCharaList.dep3)this.ordCharaList.dep3=[chara]; break;
              case 3: if(!this.ordCharaList.dep4)this.ordCharaList.dep4=[chara]; break;
              case 4: if(!this.ordCharaList.dep5)this.ordCharaList.dep5=[chara]; break;
              case 5: if(!this.ordCharaList.dep6)this.ordCharaList.dep6=[chara]; break;
              default: break;
            }
          }
          else if(dep==0){
            if(!this.ordCharaList.dep7)this.ordCharaList.dep7=[chara];
            else this.ordCharaList.dep7=[...this.ordCharaList.dep7, chara];
          }
        }
        }
      }).catch((err)=>{console.log(err)});
    }
    for(let i=0; i<this.rules.deadCh.length; i++){
        let ret=this.getIcon(this.rules.deadCh[i], false)
        if(!ret)continue;
        ret.then((res)=>{
          if(res){
            let len=0;
            for(var prop in this.ordCharaList){
              if(this.ordCharaList[prop as keyof iconList]==undefined) continue;
              len++;
            }
            let [chara, dep] = res;
              if(!this.ordCharaList.dep8)this.ordCharaList.dep8=[chara];
              else this.ordCharaList.dep8=[...this.ordCharaList.dep8, chara];}
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
    constructor() {
    }
    [Symbol.iterator]() {
      let i=0;
      return {
        next: () => {
        i++;
        if(i==6)return { done: true, value: this['dep'+i as keyof iconList] };
        return { done: false, value: this['dep'+i as keyof iconList] ?? {id: 0, name: '', icon: ''} };
        }
      };
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
    console.log("Icon to convert: ", icon);
    console.log("Lenght toFirestore: ", len);
    console.log("Dep1", icon.dep1);
    if(icon.dep1==undefined) return res;
    else res.dep1=icon.dep1;
    if(icon.dep2!==undefined) res.dep2=icon.dep2;
    if(icon.dep3!==undefined) res.dep3=icon.dep3;
    if(icon.dep4!==undefined) res.dep4=icon.dep4;
    if(icon.dep5!==undefined) res.dep5=icon.dep5;
    if(icon.dep6!==undefined) res.dep6=icon.dep6;
    if(icon.dep7!==undefined) res.dep7=icon.dep7;
    if(icon.dep8!==undefined) res.dep8=icon.dep8;
    return res;
  }
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): iconList {
      const data = snapshot.data(options) as iListFS;
      let res= new iconList()
      return res;
  }
}