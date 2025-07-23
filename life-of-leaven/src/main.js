// // import { db } from "./firebase.js";
// // import { collection, getDocs } from "firebase/firestore";

// // const recipeList = document.getElementById("recipe-list");

// // async function getRecipes() {
// //   const querySnapshot = await getDocs(collection(db, "recipes"));

// //   querySnapshot.forEach((doc) => {
// //     const data = doc.data();
  
// //     const card = document.createElement("div");
// //     card.style.border = "1px solid #ccc";
// //     card.style.padding = "1rem";
// //     card.style.marginBottom = "1rem";
// //     card.style.borderRadius = "8px";

// //     card.innerHTML = `
// //       <h2>${data.title}</h2>
// //       <p>${data.description}</p>
// //       <h4>Alapanyagok:</h4>
// //       <ul>${Array.isArray(data.ingredients) ? data.ingredients.map((ing) => `<li>${ing}</li>`).join("") : "Nincs adat"}</ul>
// //       <h4>Lépések:</h4>
// //       <ol>${Array.isArray(data.steps) ? data.steps.map((step) => `<li>${step}</li>`).join("") : "Nincs adat"}</ol>
// //         <button class="details-btn">Részletek</button>
// //     `;

// //     recipeList.appendChild(card);
// //   });
// // }

// // getRecipes();
// // import './style.css';
// import { db } from './firebase.js';
// import { collection, getDocs } from 'firebase/firestore';


// let allRecipes = [];

// const container = document.getElementById('recipes-container');
// // const filterContainer = document.getElementById('ingredient-filters');
// // const searchInput = document.getElementById('searchInput');
// const resetButton = document.getElementById('resetButton');

// async function fetchRecipes() {
//   const querySnapshot = await getDocs(collection(db, 'recipes'));
//   allRecipes = querySnapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data()
//   }));

//   renderRecipes(allRecipes);
//   //  renderIngredientFilters(allRecipes);
// }

// function renderRecipes(recipes) {
//   container.innerHTML = '';
     
//    const toc = document.getElementById('toc');
//     toc.innerHTML = '';

//   recipes.forEach((data,index) => {
//     const card = document.createElement('div');
//     card.classList.add('recipe-card');
//     const anchorId = `recipe-${data.id || index}`; // ha nincs id, akkor index alapján

//     card.id = anchorId;
//     const image = document.createElement('img');
//     image.classList.add('images');
//     image.src = data.imageUrl || 'placeholder.jpg';
//     image.alt = data.title;

//     const wrapper = document.createElement('div');
//     wrapper.classList.add('wrapper');

//     const title = document.createElement('h2');
//     title.textContent = data.title;

//     // const desc = document.createElement('p');
//     // desc.classList.add('description');
//     // desc.textContent = data.description;

//     // const ingredients = document.createElement('p');
//     // ingredients.classList.add('ingredients');
//     // ingredients.textContent = `Alapanyagok: ${data.ingredients?.slice(0, 3).join(', ') || 'nincs adat'}...`;

//     const detailsBtn = document.createElement('a');
//     detailsBtn.classList.add('details-btn');
//     detailsBtn.textContent = 'Részletek';
//     detailsBtn.href = `/recipe.html?id=${data.id}`;

//     wrapper.appendChild(title);
//     // wrapper.appendChild(desc);
//     // wrapper.appendChild(ingredients);
//     wrapper.appendChild(detailsBtn);

//     card.appendChild(image);
//     card.appendChild(wrapper);
//     container.appendChild(card);

//       const tocItem = document.createElement('li');
//       const tocLink = document.createElement('a');
//       tocLink.href = `#${anchorId}`;
//       tocLink.textContent = data.title;
//       tocItem.appendChild(tocLink);
//       toc.appendChild(tocItem);
//   });
// }


// // function renderIngredientFilters(recipes) {
// //   filterContainer.innerHTML = '';

// //   const allIngredients = new Set();
// //   recipes.forEach(r => {
// //     (r.ingredients || []).forEach(i => allIngredients.add(i.toLowerCase()));
// //   });

// //   Array.from(allIngredients).sort().forEach(ing => {
// //     const label = document.createElement('label');
// //     label.innerHTML = `
// //       <input type="checkbox" value="${ing}">
// //       ${ing}
// //     `;
// //     filterContainer.appendChild(label);
// //   });

// //   filterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
// //     cb.addEventListener('change', handleFilterChange);
// //   });
// // }

// // function handleFilterChange() {
// //   const selected = Array.from(filterContainer.querySelectorAll('input[type="checkbox"]:checked'))
// //     .map(cb => cb.value);

// //   if (selected.length === 0) {
// //     renderRecipes(allRecipes);
// //     return;
// //   }

// //   const filtered = allRecipes.filter(recipe =>
// //     selected.some(term =>
// //       recipe.ingredients?.some(i => i.toLowerCase().includes(term))
// //     )
// //   );
// //   ;

// //   renderRecipes(filtered);
// // }

// // searchInput.addEventListener('input', (e) => {
// //   const value = e.target.value.toLowerCase().trim();
// //   const searchTerms = value.split(',').map(term => term.trim()).filter(Boolean);

// //   const filtered = allRecipes.filter(recipe => {
// //     const titleMatch = recipe.title?.toLowerCase().includes(value);
// //     const ingredientsMatch = searchTerms.some(term =>
// //       recipe.ingredients?.some(i => i.toLowerCase().includes(term))
// //     );
// //     return titleMatch || ingredientsMatch;
// //   });

// //   renderRecipes(filtered);
// // });

// // resetButton.addEventListener('click', () => {
// //   searchInput.value = '';
// //   filterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
// //   renderRecipes(allRecipes);
// // });

// fetchRecipes();
// // document.getElementById('toggleFilter').addEventListener('click', () => {
// //   const filters = document.getElementById('ingredient-filters');
// //   filters.classList.toggle('hidden');
// // });



import { fetchRecipes, renderRecipes } from './recipe-card.js';
import { setupFilterButtons } from './filter.js';

document.addEventListener('DOMContentLoaded', async () => {
  const allRecipes = await fetchRecipes(); // betöltjük egyszer
  renderRecipes(allRecipes);               // megjelenítjük
  setupFilterButtons(allRecipes);          // átadjuk a gomboknak
});
