
import { addDoc, getDocs, collection, setDoc } from "firebase/firestore";
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

try {
  const docRef = await setDoc(collection(db, "users", {merge: true}), {
    first: "Alan",
    middle: "Mathison",
    last: "Turing",
    born: 1912
  });

  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}


const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

  const docRef = await addDoc(collection(db, "charas"), {
    gameID: 0,
    charID: 0,
    playerID: {owner:["AlphaTT"],borrower:[]}, //Owner, Borrower (can't pass ownership)
    ImgUrl:"public/Charas/0000.png",
    fullName:{name:"Alpha", surname:"", nickname:""},
    role:"Clerk",
    equip:["StandardW","StandardW"],
    abilities:["","",""],
    stress:0,
    trauma:["","",""],
    physHealth:[false,false,false,false,false,false,false,false,false],
    mindHealth:[false,false,false,false,false,false,false,false,false],
    exp:0,
    skills:[0,0,0,0,0,0,0,0,0,0],
    virtues:[0,0,0,0],
    gifts:[["",0],["",0],["",0],["",0],["",0]],
    mapCoord:[0,0],
    
  });
  console.log("Document written with ID: ", docRef.id);