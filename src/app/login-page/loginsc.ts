import './login-page.css';
import { initializeApp } from "firebase/app";
import {
  EmailAuthCredential,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { FireInit } from '../fire-init';

const auth = getAuth(FireInit.arguments.app);
const provider = new GoogleAuthProvider();

const username = document.createElement("input");
username.type = "text";
const password = document.createElement("input");
password.type = "password";

const login = document.createElement("button");
login.innerHTML = "login";
login.addEventListener("click", () => {
  const email = username.value;
  const pwd = password.value;
  signInWithEmailAndPassword(auth, email, pwd).catch((err) => console.log(err));
});

const logout = document.createElement("button");
logout.innerHTML = "logout";
logout.addEventListener("click", () => {
  signOut(auth).then();
});

const logWithGoogle = document.createElement("button");
logWithGoogle.innerHTML = "logWithGoogle";
logWithGoogle.addEventListener("click", () => {
  signInWithPopup(auth, provider).then();
});

const br = document.createElement("br");
const p = document.createElement("p");

const myApp = document.querySelector<HTMLDivElement>("#app")!;

//sistema QUI
//poi riprova Firebase

appendChildren(myApp, username, password, login, logWithGoogle, logout, br, p);

onAuthStateChanged(auth, (user) => {
  if (user) {
    p.innerHTML = JSON.stringify(user);
  } else {
    p.innerHTML = "";
  }
});

function appendChildren(e: HTMLElement, ...children: HTMLElement[]) {
  children.forEach((c) => e.appendChild(c));
}
