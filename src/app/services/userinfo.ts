import { inject, Injectable } from '@angular/core';
import { UserData, UserConverter } from './userdata';
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { FireInit } from '../fire-init';

@Injectable({
  providedIn: 'root',
})
export class Userinfo {
  uid:string=''
  name: string='NewUser';
  games: {date:number, name: string}[]= [];
  language: string = 'en';
  characters: string[]=[];
  borrow: string[]=[];
  code: string = ''
  friends: {name: string, id: string}[] = [];
  fireInit = inject(FireInit);
    constructor() {
      
    }
    
  async addUser(id:string=this.uid, uInfo: UserData=new UserData(this.name, this.games, this.language, this.characters, this.borrow, this.code, this.friends)) : Promise<void>{
    if(id=='') return;
    const useRef = doc(this.fireInit.db, 'userdata/'+id).withConverter(new UserConverter());
    await setDoc(useRef, uInfo);
  }

  async getUser(id:string=this.uid): Promise<void> {
    console.log("Getting user info for ID: ", id);
      let uInfo: UserData;
      if(id==''){ uInfo=new UserData; this.uid='';}
      else{const userRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
      if(snapshot1.data()==undefined) {throw new Error("User data not found for ID: " + id);}
      uInfo= snapshot1.data()!;
      this.uid=id;}
      this.name = uInfo.name;
      this.games=uInfo.games;
      this.language=uInfo.language;
      this.characters=uInfo.characters;
      this.borrow=uInfo.borrow;
      this.code=uInfo.code;
      this.friends=uInfo.friends;
    }
  
  async getUserData(id:string=this.uid): Promise<UserData> {
    if(id=='') return new UserData;
    const userRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter());
    const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
    const  uInfo= snapshot1.data()!;
    return uInfo;
  }
  
}
