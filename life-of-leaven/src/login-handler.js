// src/login-handler.js  google bejelentkezés
import { auth } from './firebase.js';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const status = document.getElementById("status");

loginBtn?.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Sikeres bejelentkezés:", user.email);
      status.textContent = `Bejelentkezve: ${user.email}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline";

      // Csak admin UID-vel engedjük a továbblépést
      if (user.uid === "AG6270vZhmbju1ufqKwJWnNFzef2") {
        window.location.href = "recipe-admin-form.html";
      } else {
        alert("Nincs jogosultságod a recept feltöltéshez.");
        signOut(auth);
      }
    })
    .catch((error) => {
      console.error("Bejelentkezési hiba:", error);
      status.textContent = "Hiba a bejelentkezés során.";
    });
});

logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    status.textContent = "Kijelentkezve.";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    status.textContent = `Bejelentkezve: ${user.email}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    status.textContent = "Nincs bejelentkezve.";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});
