import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chara-sheet',
  imports: [NgTemplateOutlet, RouterOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})
export class CharaSheet {

}

import { collection, getDocs } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAl6MOHLbKkHSp2UTNmmkzRZphfthmEn3E",
  authDomain: "third-trumpet.firebaseapp.com",
  projectId: "third-trumpet",
  storageBucket: "third-trumpet.firebasestorage.app",
  messagingSenderId: "218218565698",
  appId: "1:218218565698:web:e02d7bf55af32ab7251ddb",
  measurementId: "G-3RHTFBTNWY"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});