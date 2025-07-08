// import { db } from './firebase.js';
// import { doc, getDoc } from 'firebase/firestore';

// const container = document.getElementById('recipe-detail');

// // 🔍 Recept ID lekérése az URL-ből
// const params = new URLSearchParams(window.location.search);
// const recipeId = params.get('id');

// async function fetchRecipeDetail(id) {
//   const docRef = doc(db, 'recipes', id);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     const data = docSnap.data();

//     container.innerHTML = `
//       <div class="recipe-card">
//         <img class="images" src="${data.imageUrl || 'placeholder.jpg'}" alt="${data.title}" />
//         <div class="wrapper">
//           <h2>${data.title}</h2>
//           <p class="description">${data.description}</p>
//           <h3>Alapanyagok:</h3>
//           <ul>${data.ingredients.map((ing) => `<li>${ing}</li>`).join('')}</ul>
//           <h3>Lépések:</h3>
//           <ol>${data.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
//           <a href="index.html" class="back-btn">Vissza</a>
//         </div>
//       </div>
//     `;
//   } else {
//     container.innerHTML = '<p>A recept nem található.</p>';
//   }
// }

// if (recipeId) {
//   fetchRecipeDetail(recipeId);
// } else {
//   container.innerHTML = '<p>Nincs recept ID megadva.</p>';
// }


// recipe.js
// import { db } from './firebase.js';
// import { collection, getDocs,query,where,orderBy } from 'firebase/firestore';

// const grid = document.getElementById('recipe-grid');

// async function loadRecipes() {
//   const querySnapshot = await getDocs(collection(db, 'recipes'));

//   querySnapshot.forEach((doc) => {
//     const data = doc.data();

//     const card = document.createElement('div');
//     card.classList.add('recipe-card');
//     card.setAttribute('data-category', data.category || 'egyéb');

//     card.innerHTML = `
//       <img src="${data.imageUrl || 'placeholder.jpg'}" alt="${data.title}" />
//       <h2>${data.title}</h2>
//       <p>${data.description}</p>
//       <a href="recipe-details.html?id=${doc.id}" class="btn">Megnézem</a>
//     `;

//     grid.appendChild(card);
//   });
// }

// loadRecipes();


import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const recipeGrid = document.getElementById('recipe-grid');
const buttons = document.querySelectorAll('.filter-btn');

let allRecipes = []; // 💡 Ide töltjük be egyszer az összes receptet

async function fetchAndDisplayRecipes() {
  const querySnapshot = await getDocs(
    collection(db, 'recipes'));
  allRecipes = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    allRecipes.push({ id: doc.id, ...data });  
  });

  renderRecipes(allRecipes); // 🔁 Megjelenítjük az összes receptet
}

function renderRecipes(recipes) {
  recipeGrid.innerHTML = '';  
  recipes.forEach((recipe) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <img src="${recipe.imageUrl || 'placeholder.jpg'}" alt="${recipe.title}">
      <h2>${recipe.title}</h2>
      <p>${recipe.description || ''}</p>
      <a href="recipe-detail.html?id=${recipe.id}" class="btn">Megnézem</a>
    `;

    recipeGrid.appendChild(card);
  });
}

// 👇 Kattintás figyelése a kategóriagombokra
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    // 1️⃣ Gombok stílusának kezelése
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.category;

    // 2️⃣ Szűrés logikája
    if (category === 'all') {
      renderRecipes(allRecipes); // vissza az összes
    } else {
      const filtered = allRecipes.filter(
        (recipe) => recipe.category?.toLowerCase() === category.toLowerCase()
      );
      renderRecipes(filtered);
    }
  });
});

// 🚀 Kezdéskor betöltjük az adatokat
fetchAndDisplayRecipes();
