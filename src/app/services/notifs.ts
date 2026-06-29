import { inject, Injectable } from '@angular/core';
import { Sharedrules } from './sharedrules';
import { FireInit } from '../fire-init';
import { doc, setDoc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { MessageConverter, Notifclass, NotifS } from '../notifclass';

@Injectable({
  providedIn: 'root',
})
export class Notifs {
  rules=inject(Sharedrules);
  init=inject(FireInit);
  last5:[string, string, string, string, string]= ['','','','',''];
  trumpets:number=0;

  constructor(){
  }

  async trumpetSound(tier:number){
  if(!("Notification"in window)){
    alert("This browser does not support desktop notification");
  }else if(Notification.permission==='granted'){
    switch(tier){
      case 1:{
    var notification=new Notification("First Trumpet!",{
      lang: 'en',
      body:"",
      icon: "FirstIco.ico",
    });} break;
    case 2:{
    var notification=new Notification("Second Trumpet!!",{
      lang: 'en',
      body:"",
      icon: "SecondIco.ico",
    });} break;
    case 3:{
    var notification=new Notification("Third Trumpet!!!",{
      lang: 'en',
      body:"",
      icon: "ThirdIco.ico",
    })} break;
    case 0:{var notification=new Notification("The Trumpet's Over",{
      lang: 'en',
      body:"",
      icon: "Undo.ico",
    })} break;
    default: break; //4th se la partita viene cancellata?
    }
  }else if(Notification.permission !== 'denied'){
    try{
      let permission=await Notification.requestPermission();
      if (permission=='granted'){ const notification= new Notification("Example");}
    }catch(err){console.log(err);}
  }
  }
    async addMessage(date=this.rules.gameID, name=this.rules.name) : Promise<void>{
      if(date==0) return; //per evitare di sovrascrivere il char0 di default quando si preme salva senza aver caricato un char o creato un nuovo char con id diverso da 0
      const notifRef = doc(this.init.db, 'message/' + name + '-' + date).withConverter(new MessageConverter());
      await setDoc(notifRef, this);
    }
    async getMessage(date=this.rules.gameID, name=this.rules.name){
      if(date==0) return; 
      const notifRef = doc(this.init.db, 'message/' + name + '-' + date).withConverter(new MessageConverter());
          const snapshot1: DocumentSnapshot<Notifclass> = await getDoc(notifRef);
          const uNotif = snapshot1.data()!;
          if(uNotif){
            this.last5 = uNotif.last5;
            //Se cacheable  if(this.trumpets!=uNotif.trumpets)this.trumpetSound(uNotif.trumpets);
            this.trumpets=uNotif.trumpets;
          }
    }
}
