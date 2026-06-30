import { inject, Injectable } from '@angular/core';
import { UserData, UserConverter } from './userdata';
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { FireInit } from '../fire-init';

@Injectable({
  providedIn: 'root',
})
export class Userinfo {
  name: string='NewUser';
  games: {date:number, name: string}[]= [];
  language: string = 'en';
  characters: string[]=[];
  borrow: string[]=[];
  code: string = ''
  uid:string=''
  fireInit = inject(FireInit);
    constructor() {
      
    }
    
  async addUser(id:string=this.uid) : Promise<void>{
    if(id=='') return;
    const useRef = doc(this.fireInit.db, 'userdata/'+id).withConverter(new UserConverter());
    await setDoc(useRef, new UserData(this.name, this.games, this.language, this.characters, this.borrow, this.code));
  }

  async getUser(id:string=this.uid): Promise<void> {
    console.log("Getting user info for ID: ", id);
      let uInfo=new UserData;
      if(id!=''){const userRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
      uInfo= snapshot1.data()!;
      this.uid=id;}
      else this.uid='';
      this.name = uInfo.name;
      this.games=uInfo.games;
      this.language=uInfo.language;
      this.characters=uInfo.characters;
      this.borrow=uInfo.borrow;
      this.code=uInfo.code;
    }
}
