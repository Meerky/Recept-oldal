 import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore'; 

let allRecipes = [];

async function fetchRecipes() {
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  allRecipes = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  allRecipes.sort((a, b) =>
    a.title.localeCompare(b.title, 'hu', { sensitivity: 'base' })
  );
  renderRecipes(allRecipes);
  //  renderIngredientFilters(allRecipes);
}

function renderRecipes(recipes) {
  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  const toc = document.getElementById('toc');
  toc.innerHTML = '';

  recipes.forEach((data, index) => {
    const anchorId = `recipe-${data.id || index}`;

    // 👉 Tartalomjegyzék elem
    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    tocLink.href = `#${anchorId}`;
    tocLink.textContent = data.title;
    tocItem.appendChild(tocLink);
    toc.appendChild(tocItem);

    // 👉 Receptkártya
    const card = document.createElement('div');
    card.classList.add('recipe-box');
    card.id = anchorId;

    const img = document.createElement('img');
    img.src = data.imageUrl || 'pics/placeholder.jpg';
    img.alt = data.title || 'Recept képe';

    const title = document.createElement('h2');
    title.textContent = data.title;

    const desc = document.createElement('p');
    desc.textContent = data.presentation || 'Nincs rövid leírás.';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);

    container.appendChild(card);
  });
}
 
fetchRecipes(); 
//  kategória választó 
// Kategória választó gombok lekérése
const buttons = document.querySelectorAll('.filter-btn');
 
// végig megyünk  a kategória választó gombokon
buttons.forEach((button)=>{
  button.addEventListener('click',() =>{
   // Gombok kinézetének frissítése: először eltávolítjuk az "active" osztályt az összes gombtól
buttons.forEach((btn) => btn.classList.remove('active'));
    // Majd hozzáadjuk az "active" osztályt a kiválasztott gombhoz
button.classList.add('active');

//A gomb HTML-ben megadott 'data-category' attribútumát olvassuk ki
const category = button.dataset.category;

//szűrés logikája

if(category === 'all'){
  //ha a kategória === all akkor az összes receptet jelenitse meg
  renderRecipes(allRecipes);
}else{

 // Különben kiszűrjük csak azokat, amelyeknek a category mezője megegyezik
  const filtered = allRecipes.filter(
    // ha a recept kategórija megegyezik a kiválasztott kategóriával
    (recipe) => recipe.category?.toLowerCase() === category.toLowerCase()
   // Itt ellenőrizzük:
        // - van-e 'category' mező (a "?" az opcionális láncolás, elkerüli a hibát, ha nincs)
        // - ha van, kisbetűssé alakítjuk és összehasonlítjuk a kiválasztott kategóriával (szintén kisbetűsre alakítva)
    
  );
  //megjelenítjük a szűrt recepteket
  renderRecipes(filtered);
}
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.tartalom');
  
  const tocList = document.getElementById('toc');

  const arrow = document.querySelector('.arrow');

  menuToggle.addEventListener('click', () => {
    tocList.classList.toggle('active');
    arrow.textContent = tocList.classList.contains('active') ? '▴' : '▾';
  })
});
// Keresés összetevők alapján
const searchInput = document.getElementById('searchInput');
function searchRecipes() {
  const value = searchInput.value.toLowerCase().trim();
  const searchTerms = value
    .split(',')
    .map(term => term.trim())
    .filter(Boolean);

  // Ha nincs mit keresni, mutasson mindent
  if (searchTerms.length === 0) {
    renderRecipes(allRecipes);
    return;
  }

  const filtered = allRecipes
    .map(recipe => {
      const recipeIngredients = recipe.ingredients?.map(i => i.toLowerCase()) || [];
      const matchedCount = searchTerms.filter(term =>
        recipeIngredients.some(ing => ing.includes(term))
      ).length;

      const matchRatio = matchedCount / searchTerms.length;

      return {
        recipe,
        matchedCount,
        matchRatio
      };
    })
    .filter(item => item.matchRatio >= 0.4) // min. 60% egyezés kell
    .sort((a, b) => b.matchedCount - a.matchedCount) // legtöbb egyezés előre
    .map(item => item.recipe);

  renderRecipes(filtered);
}
searchInput.addEventListener('input', searchRecipes);
