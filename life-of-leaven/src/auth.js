import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');

const ADMIN_UID = "AZ_ADMIN_UID";  // ide írd be az admin UID-t

loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Bejelentkezett:", result.user.email);
    })
    .catch(error => {
      console.error("Hiba a bejelentkezésnél:", error);
    });
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    if(user.uid === ADMIN_UID) {
      userInfo.style.display = 'block';
      userEmail.textContent = `Bejelentkezve: ${user.email}`;
      loginBtn.style.display = 'none';
      // Megjeleníted az admin funkciókat (feltöltő form, stb.)
    } else {
      alert("Nem vagy jogosult az admin felülethez!");
      signOut(auth);
    }
  } else {
    userInfo.style.display = 'none';
    loginBtn.style.display = 'block';
  }
});


import {registerUser} from "./handlers/registerHandler.js";
import { loginUser } from "./handlers/loginHandler.js";

document.addEventListener("DOMContentLoaded", () => {

  const registrationForm = document.getElementById("registration-form");

  if(registrationForm){
    registrationForm.addEventListener("submit", async function (e){
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try{
        await registerUser({email,password,name});
        alert("Sikeres regisztráció");
        registrationForm.reset()
      } catch(error){
        alert("Hiba:" +error.message);
      }
    });
  }

  // login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        await loginUser(email, password);
    
        // window.location.href = "ujodal.html";
      } catch (error) {
        alert("Hiba: " + error.message);
      }
    });
  } 
});