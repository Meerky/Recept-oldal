import {db} from './firebase.js';
import {collection,getDocs} from 'firebase/firestore';

// itt jelenitjük meg a recept kártyákat

const recipeCard = document.getElementById('recipes-container');
console.log(recipeCard);

let allRecipes = [];

async function fetchAndDisplayRecipes() {
  const querySnapshot = await getDocs(
    collection(db, 'recipes')
  );
  allRecipes = [];

  querySnapshot.forEach((doc) =>{
    const data = doc.data();

    allRecipes.push({id: doc.id, ...data});
  });
  renderRecipes(allRecipes);
}
function renderRecipes(recipes){
  recipeCard.innerHTML = '';

  recipes.forEach((recipe) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML= `
    <img src="${recipe.imageUrl || 'placeholder.jpg'}" alt="${recipe.title}">
    <h2>${recipe.title}</h2>
      <p>${recipe.description || ''}</p>
      <a href="recipe-detail.html?id=${recipe.id}" class="btn">Megnézem</a>
    
    
    `
    recipeCard.appendChild(card);
  })
}fetchAndDisplayRecipes();

export { renderRecipes, allRecipes };