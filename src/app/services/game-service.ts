import { inject, Injectable } from '@angular/core';
import { Sharedrules } from './sharedrules';
import { IconsNames } from './icons-names';
import { FireInit } from '../fire-init';
import { Userinfo } from './userinfo';
import { CharaConverter } from '../chara-sheet/characlass';
import { doc, deleteDoc, getDoc, DocumentSnapshot, setDoc, namedQuery, waitForPendingWrites } from 'firebase/firestore';
import { Rules, RulesConverter } from '../rules';
import { UserConverter, UserData } from './userdata';
import { Iconsclass } from '../iconsclass';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  rules=inject(Sharedrules);
  info=inject(Userinfo);
  iconsNames = inject(IconsNames);
  init=inject(FireInit);


  async deleteChara(n: number=this.rules.lookFor, dep:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    if(n==0) return;
    if(this.info.characters.includes(name+'-'+date+'-'+n)){
    this.info.characters=this.info.characters.filter(c=>c!=name+'-'+date+'-'+n);
    this.info.addUser(this.info.uid);
    }else if(!this.rules.isDM)return;

    const charRef = doc(this.init.db, 'charas/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    await deleteDoc(charRef);
    if(temp){
    if(!this.rules.depsList.includes(dep))return;
    let ind=(dep>0?'dep'+this.rules.depsList.indexOf(dep):'reserves')
    if(this.rules.deadCh.includes(n)){
      ind='dead';
      this.rules.deadCh=this.rules.deadCh.filter(c=>c!=n);
    }
      else this.rules.charaList=this.rules.charaList.filter(c=>c!=n);
    this.iconsNames.ordCharaList[ind as keyof Iconsclass]=this.iconsNames.ordCharaList[ind as keyof Iconsclass]?.filter(c=>c.id!=n);
    this.rules.addRules();
    this.iconsNames.addList(false);
    } //temp vuol dire che non è per cancellare la partita, altrimenti rischio di salvare le regole dopo che sono state cancellate perché è asynch
  }

  async deleteAbno(n: number=this.rules.lookFor, dep:number=this.rules.lookDep,  name=this.rules.name, date=this.rules.gameID, temp: boolean=true){
    const abnoRef = doc(this.init.db, 'gameabnos/'+ name + '-' + date + '-' + n).withConverter(new CharaConverter());
    if(!this.rules.isDM) return;
    await deleteDoc(abnoRef);
    if(!this.rules.depsList.includes(dep))return;
    if(temp){ 
      let ind=(dep>0?'dep'+this.rules.depsList.indexOf(dep):'reserves')
      this.rules.abnoList=this.rules.abnoList.filter(c=>c!=n);
      this.iconsNames.ordAbnoList[ind as keyof Iconsclass]=this.iconsNames.ordAbnoList[ind as keyof Iconsclass]?.filter(c=>c.id!=n);
      this.rules.addRules();
      this.iconsNames.addList(true);
    }
  }

  async deleteGame(name:string, date:number, you:string=this.info.uid){
    const rulesRef=doc(this.init.db, 'rules/' + name + '-' + date).withConverter(new RulesConverter());
    const snapshot1: DocumentSnapshot<Rules> = await getDoc(rulesRef);
    let uRules = snapshot1.data()!;
    if(!uRules.DMIds.includes(you)) return;
    for (const element of uRules.charaList) {this.deleteChara(element, undefined, name, date, false);}
    for (const element of uRules.deadCh){this.deleteChara(element, undefined, name, date, false);}
    for (const element of uRules.abnoList){this.deleteAbno(element, undefined, name, date, false);}
    this.iconsNames.deleteList(false, name, date);
    this.iconsNames.deleteList(true, name, date);

    for (const element of uRules.DMIds){
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            let datee=date.toString();
            let l=uInfo.characters.length;
            for(let i=0;i<l;i++){
              let [nam,dat,num]=uInfo.characters[i].split('-');
              if(nam==name && dat==datee){ uInfo.characters=uInfo.characters.filter(c=>c!=uInfo.characters[i]);
                l--;
                i--;
              }
            }
            if(element==you){this.info.games=uInfo.games;
              this.info.characters=uInfo.characters;
            }
            setDoc(userRef, uInfo)
    }
    for (const element of uRules.playerIDs){
      const userRef = doc(this.init.db, 'userdata/'+element).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
            let uInfo: UserData = snapshot1.data()!;
            uInfo.games=uInfo.games.filter(c=>c.date!=date && c.name!=name);
            let datee=date.toString();
            let l=uInfo.characters.length;
            for(let i=0;i<l;i++){
              let [nam,dat,num]=uInfo.characters[i].split('-');
              if(nam==name && dat==datee){ uInfo.characters=uInfo.characters.filter(c=>c!=uInfo.characters[i]);
                l--;
                i--;
              }
            }
            setDoc(userRef, uInfo);
    }
    this.rules.deleteRules(date, name);
  }

}
