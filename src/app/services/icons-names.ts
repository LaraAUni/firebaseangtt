import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { doc, getDoc, DocumentSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { FireInit } from '../fire-init';
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from '../abno-sheet/abnoclass';
import { Character, CharaConverter } from '../chara-sheet/characlass';
import { Sharedrules } from './sharedrules';
import { Iconsclass, listConverter } from '../iconsclass';

@Injectable({
  providedIn: 'root',
})


export class IconsNames {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  ordCharaList: {id: number, name: string, icon: string}[][] = [];
  ordAbnoList: {id: number, name: string, icon: string}[][] = [];
  constructor() {
  }
  

  async addList(bool: boolean) : Promise<void>{
        const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());
        console.log('FirstChara:',this.ordCharaList[0])
        let list=(new Iconsclass());
        console.log("List to save: ", list);
        await setDoc(listRef, list);
  }
  
  async getList(bool: boolean) : Promise<void>{
    const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (bool?'Ag':'Ab')).withConverter(new listConverter());
        const snapshot1: DocumentSnapshot<Iconsclass> = await getDoc(listRef);
        const list: Iconsclass = snapshot1.data()!;
        if (list) {
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

  async makeList(type:boolean){; //CharaList funziona, quindi???
    console.log("Lists: ", this.rules.charaList , this.rules.abnoList);
    if(type){
    this.ordAbnoList=Array(6).fill([]);
    if(type && this.rules.abnoList.length==0) return
      for(let i=0; i<this.rules.abnoList.length; i++){
        let ret=this.getIcon(this.rules.abnoList[i], true)
        if(!ret)continue;
        ret.then((res)=>{
          if(res){
            let [ico, dep] = res;
          for(let j=0; j<this.rules.depsList.length; j++){
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
    this.ordCharaList=Array(8).fill([]);
    if(!type && this.rules.charaList.length==0 && this.rules.deadCh.length==0)return;
    for(let i=0; i<this.rules.charaList.length; i++){
      let ret=this.getIcon(this.rules.charaList[i], false)
      if(!ret)continue;
      ret.then((res)=>{
        if(res){
          let [chara, dep] = res;
          if(dep==0){
          if(!this.ordCharaList[6])this.ordCharaList[6]=[chara];
             else this.ordCharaList[6]=[...this.ordCharaList[6], chara];}
          else for(let j=0; j<this.rules.depsList.length; j++){
          if(dep==this.rules.depsList[j]){
            if(!this.ordCharaList[j])this.ordCharaList[j]=[chara];
             else this.ordCharaList[j]=[...this.ordCharaList[j], chara];
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
            let [chara, dep] = res;
              if(!this.ordCharaList[7])this.ordCharaList[7]=[chara];
              else this.ordCharaList[7]=[...this.ordCharaList[7], chara];
          }
        }).catch((err)=>{console.log(err)});
    }
    this.addList(type);
  }

  async deleteList(id:number ,type:boolean){
    const listRef = doc(this.fireInit.db, 'icolist/' + this.rules.gameID +'-'+ (type?'Ag':'Ab')).withConverter(new listConverter());
    deleteDoc(listRef);
  };

  async toReserve(n: number, ind: number, id=this.rules.gameID){
    if(ind==0) return;
    const charRef = doc(this.fireInit.db, 'charas/' + this.rules.gameID + '-' + id).withConverter(new CharaConverter()); //Icons a parte per leggere meno roba!
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          let uChara: Character = snapshot1.data()!;
          uChara.role[1]=0;
          if(!this.rules.deadCh.includes(n)){
          this.ordCharaList[ind]=this.ordCharaList[ind].filter(c=>c.id!=n);
          this.ordCharaList[6]=[...this.ordCharaList[6], {id:n, name:uChara.fullName, icon:uChara.icoUrl}];}
          await setDoc(charRef, uChara);
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
          let res = { id: id, name: (uData.clock1[0] == uData.clock1[1] ? (uChara.fullName.Nickname ? (uData.trueNameRev ? uChara.fullName.Name : uChara.fullName.Nickname) : uChara.fullName.Name) : "???" ), icon: uChara.icoUrl };
          return [res,uData.department];
    }
    return null;
  }
}

