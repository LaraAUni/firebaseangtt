import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Notifs {
  last5:string[];
  trumpets:number;

  constructor(){
    this.last5=[];
    this.trumpets=0;
  }

  trumpetSound(tier:number){
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
    default: break;
    }
  }else if(Notification.permission !== 'denied'){
    Notification.requestPermission().then((permission)=>{
      if (permission=='granted'){ const notification= new Notification("Example");}
    })
  }
  }
}

