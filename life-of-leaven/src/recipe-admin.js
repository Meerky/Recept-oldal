import { db } from './firebase.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const recipeForm = document.getElementById("recipeForm");

function addIngredient() {
  const container = document.getElementById('ingredients-container');
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'ingredient';
  input.placeholder = 'Hozzávaló';
  container.appendChild(input);
}

function addStep() {
  const container = document.getElementById('steps-container');
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'step';
  input.placeholder = 'Lépés leírása';
  container.appendChild(input);
}

window.addIngredient = addIngredient;
window.addStep = addStep;

recipeForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  const ingredients = Array.from(document.getElementsByName("ingredient"))
    .map(input => input.value.trim())
    .filter(val => val !== "");

  const steps = Array.from(document.getElementsByName("step"))
    .map(input => input.value.trim())
    .filter(val => val !== "");

  try {
    await addDoc(collection(db, 'recipes'), {
      title,
      imageUrl,
      category,
      description,
      ingredients,
      steps,
      createdAt: serverTimestamp()
    });
    alert("✅ A recept sikeresen feltöltve!");
    recipeForm.reset();
    // Eltávolít minden plusz mezőt
    document.getElementById("ingredients-container").innerHTML =
      '<input type="text" name="ingredient" placeholder="Hozzávaló" required />';
    document.getElementById("steps-container").innerHTML =
      '<input type="text" name="step" placeholder="Lépés leírása" required />';
  } catch (err) {
    alert("❌ Nem sikerült a feltöltés.");
    console.error("Hiba a feltöltésnél", err);
  }
  if (!title || !description || ingredients.length === 0 || steps.length === 0) {
    alert("Kérlek, töltsd ki az összes kötelező mezőt!");
    return;
  }


});


import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logOut");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("✅ Kijelentkezve");
        localStorage.removeItem("userRole"); // ha tároltad
        alert("Sikeresen kijelentkeztél!");
        window.location.href = "/login2.html"; // ide irányítsd vissza
      } catch (error) {
        console.error("❌ Hiba kijelentkezéskor:", error);
        alert("Hiba kijelentkezéskor: " + error.message);
      }
    });
  }

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  const userInfo = document.getElementById("user-info");

  if (name) {
    userInfo.textContent = `Bejelentkezve mint: ${name}`;
  } else {
    userInfo.textContent = `Bejelentkezve: ${email}`;
  }

});


