import { inject, Injectable } from '@angular/core';
import { UserData, UserConverter } from './userdata';
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { FireInit } from '../fire-init';

@Injectable({
  providedIn: 'root',
})
export class Userinfo {
  info=new UserData;
  fireInit = inject(FireInit);
  id:string='';
    constructor() {
      
    }
    
  async addUser(id:string=this.id) : Promise<void>{
    if(id=='') return;
    const useRef = doc(this.fireInit.db, 'userdata/'+id).withConverter(new UserConverter());
    await setDoc(useRef, this.info);
  }

  async getUser(id:string=this.id): Promise<void> {
    console.log("Getting user info for ID: ", id);
    if(id=='') return;
      const userRef = doc(this.fireInit.db, 'userdata/' + id).withConverter(new UserConverter());
      const snapshot1: DocumentSnapshot<UserData> = await getDoc(userRef);
      const uInfo: UserData = snapshot1.data()!;
      if (uInfo) {
      this.info = uInfo;
      console.log("User info retrieved: ", this.info);
      }
    }

    
}
