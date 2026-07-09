import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { doc, getDoc, DocumentSnapshot, setDoc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { FireInit } from '../fire-init';
import { Abnormality, AbnoData, AbnoConverter, DataConverter } from '../abno-sheet/abnoclass';
import { Character, CharaConverter } from '../chara-sheet/characlass';
import { Departments, Sharedrules } from './sharedrules';
import { Iconsclass, listConverter } from '../iconsclass';

@Injectable({
  providedIn: 'root',
})


export class IconsNames {
  fireInit = inject(FireInit);
  rules = inject(Sharedrules);
  ordCharaList: Iconsclass = new Iconsclass;
  ordAbnoList: Iconsclass = new Iconsclass;
  constructor() {
  }
  

  async addList(bool: boolean, name: string = this.rules.name, gameID: number = this.rules.gameID) : Promise<void>{
        const listRef = doc(this.fireInit.db, 'icolist/' + name + '-' + gameID +'-'+ (bool?'Ab':'Ag')).withConverter(new listConverter());
        await setDoc(listRef, (bool?this.ordAbnoList:this.ordCharaList));
  }

  async getList(bool: boolean, name: string = this.rules.name, gameID: number = this.rules.gameID) : Promise<void>{
    const listRef = doc(this.fireInit.db, 'icolist/' + name + '-' + gameID +'-'+ (bool?'Ab':'Ag')).withConverter(new listConverter());
        const snapshot1: DocumentSnapshot<Iconsclass> = await getDoc(listRef);
        const list: Iconsclass = snapshot1.data()!;
        if (list) {
          if(bool) {
            this.ordAbnoList=list;
            let tot=0;
            for (const element in this.ordAbnoList) {
              const dep=this.ordAbnoList[element as keyof Iconsclass];
              tot+=dep.length;
            }
            if(tot<this.rules.abnoList.length) await this.makeList(bool);
          console.log("Finished List: ", this.ordAbnoList);
          }
          else {
            this.ordCharaList=list;
            let tot=0;
            for (const element in this.ordCharaList) {
              const dep=this.ordCharaList[element as keyof Iconsclass];
              tot+=dep.length;
            }
            if(tot<(this.rules.charaList.length+this.rules.deadCh.length)) await this.makeList(bool);
        console.log("Finished List: ", this.ordCharaList);
          }
        }else{
          try{
          await this.makeList(bool);
          }catch(err){console.log(err)}
        }
  }

  async makeList(type:boolean){; //true=abnos
    console.log("Lists: ", this.rules.charaList , this.rules.abnoList);
    if(type){
    this.ordAbnoList=new Iconsclass;
    if(this.rules.abnoList.length==0) return;
      for(let i=0; i<this.rules.abnoList.length; i++){
          console.log("Called once?")
        try{
          const res= await this.getIcon(this.rules.abnoList[i], true)
        if(!res)continue;
          if(res){
            const [ico, dep] = res;
            const d=this.rules.depsList.indexOf(dep);
            if(d>=0)this.ordAbnoList['dep'+d as keyof Iconsclass]=[...this.ordAbnoList['dep'+d as keyof Iconsclass]??[], ico];
          }
        }catch(err){console.log(err)};
      }
    console.log("New List:", this.ordAbnoList);
    await this.addList(type);
    return;
    }
    this.ordCharaList=new Iconsclass;
    if(this.rules.charaList.length==0 && this.rules.deadCh.length==0)return;
    for(let i=0; i<this.rules.charaList.length; i++){
      console.log("Called once? Chara N°", i+1)
      try{
      const res= await this.getIcon(this.rules.charaList[i], false);
      if(!res)continue;
          const [chara, dep] = res;
          const d=this.rules.depsList.indexOf(dep)
            if(d>=0)this.ordCharaList['dep'+d as keyof Iconsclass]=[...this.ordCharaList['dep'+d as keyof Iconsclass]??[], chara];
            else this.ordCharaList.reserves=[...this.ordCharaList.reserves, chara];
        }catch(err){console.log(err);}
    }
    for(let i=0; i<this.rules.deadCh.length; i++){
        try{
          const res=await this.getIcon(this.rules.deadCh[i], false)
                  if(!res)continue;
                    const [chara, dep] = res;
                    this.ordCharaList.dead=[...this.ordCharaList.dead, chara];
        }catch(err){console.log(err);}
    }
    console.log("New List:", this.ordCharaList);
    await this.addList(type);
  }

  async deleteList(type:boolean, name:string=this.rules.name, gameID:number=this.rules.gameID){
    const listRef = doc(this.fireInit.db, 'icolist/' + name + '-' + gameID +'-'+ (type?'Ab':'Ag')).withConverter(new listConverter());
    await deleteDoc(listRef);
  };

  async toReserve(id: number, ind: number, gameID=this.rules.gameID, name=this.rules.name){
    if(ind==0) return;
    const charRef = doc(this.fireInit.db, 'charas/' + name + '-' + gameID + '-' + id).withConverter(new CharaConverter()); //Icons a parte per leggere meno roba!
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          let uChara: Character = snapshot1.data()!;
          uChara.role[1]=0;
          if(ind<0||ind>5) return;
          if(!this.rules.deadCh.includes(id)){
          this.ordCharaList['dep'+ind as keyof Iconsclass]=this.ordCharaList['dep'+ind as keyof Iconsclass].filter(c=>c.id!=id);
          this.ordCharaList.reserves=[...this.ordCharaList.reserves, {id, name: uChara.fullName, icon: uChara.icoUrl}];}
          await setDoc(charRef, uChara);
          await this.addList(false);
  }

 async getIcon(id: number, type: boolean, name: string = this.rules.name, gameID: number = this.rules.gameID) : Promise<[{id: number, name: string, icon: string}, number]|null>{
    if(type){
          const charRef = doc(this.fireInit.db, 'abnos/'+id).withConverter(new AbnoConverter());
          const snapshot1: DocumentSnapshot<Abnormality> = await getDoc(charRef);
          const uChara: Abnormality = snapshot1.data()!;
          const charRef2 = doc(this.fireInit.db, 'gameabnos/'+ name + '-' + gameID + '-' + id).withConverter(new DataConverter());
          const snapshot2: DocumentSnapshot<AbnoData> = await getDoc(charRef2);
          const uData: AbnoData = snapshot2.data()!;
          let res = { id: id, name: (uData.clock1[0] == uData.clock1[1] ? (uChara.fullName.Nickname ? (uData.trueNameRev ? uChara.fullName.Name : uChara.fullName.Nickname) : uChara.fullName.Name) : "???" ), icon: uChara.icoUrl };
          return [res, uData.department];
    }else{
      const charRef = doc(this.fireInit.db, 'charas/' + name + '-' + gameID + '-' + id).withConverter(new CharaConverter()); //Icons a parte per leggere meno roba!
          const snapshot1: DocumentSnapshot<Character> = await getDoc(charRef);
          const uChara: Character = snapshot1.data()!;
          let res = { id: id, name: uChara.fullName, icon: uChara.icoUrl };
          return [res, uChara.role[1]];
    }
  }
}

