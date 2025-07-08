import {db} from './firebase.js';
import {collection,getDocs} from 'firebase/firestore';

// Itt jelenítjük meg a receptkártyákat
const recipeGrid = document.getElementById('recipe-grid');

// Kategória választó gombok lekérése
const buttons = document.querySelectorAll('.filter-btn');
let allRecipes = []; // ide töltjük be az összes receptet

async function fetchAndDisplayRecipes() {
  // Lekérjük a 'recipes' kollekciót a Firebase-ből
  const querySnapshot = await getDocs(

    collection(db, 'recipes')// a recipes collection a firebasebol 
  );

  allRecipes= [];
  //végig megy az összes doc-on 
  querySnapshot.forEach((doc) =>{

    const data = doc.data();  // A dokumentum (recept) tényleges tartalma

    // hozzá adja a receptet a receptek tömbjéhez 
    allRecipes.push({id: doc.id, ...data});      
  });

renderRecipes(allRecipes); //az összes receptet megjeleniti a képernyön 

// renderIngredientFilters(allRecipes);
}
function renderRecipes(recipes) {
 // Kiürítjük a recept konténert, hogy ne jelenjenek meg duplikációk

  recipeGrid.innerHTML = '';  

    // Végigmegyünk a kapott receptek tömbjén
  recipes.forEach((recipe) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card'); // hozzáadjuk a kártya stílusát
 
    // Beállítjuk a kártya tartalmát HTML-ként:
    card.innerHTML = `
      <img src="${recipe.imageUrl || 'placeholder.jpg'}" alt="${recipe.title}">
      <h2>${recipe.title}</h2>
      <p>${recipe.description || ''}</p>
      <a href="recipe-detail.html?id=${recipe.id}" class="btn">Megnézem</a>
    `;
 // Hozzáadjuk a kész kártyát a recept konténerhez
    recipeGrid.appendChild(card);


  });
}

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
fetchAndDisplayRecipes();
console.log("Receptek betöltése elindult...");




// Keresés összetevők alapján
const searchInput = document.getElementById('searchInput');

// searchInput.addEventListener('input', (e) => {
//   const value = e.target.value.toLowerCase().trim();
//   const searchTerms = value.split(',').map(term => term.trim()).filter(Boolean);

//   const filtered = allRecipes.filter(recipe => {
//     const titleMatch = recipe.title?.toLowerCase().includes(value);
//     const ingredientsMatch = searchTerms.some(term =>
//       recipe.ingredients?.some(i => i.toLowerCase().includes(term))
//     );
//     return titleMatch || ingredientsMatch;
//   });

//   renderRecipes(filtered);
// });

// keresés checbox
// const filterContainer = document.getElementById('ingredient-filters');
// function renderIngredientFilters(recipes) {
//   filterContainer.innerHTML = '';

//   const allIngredients = new Set();
//   recipes.forEach(r => {
//     (r.ingredients || []).forEach(i => allIngredients.add(i.toLowerCase()));
//   });

//   Array.from(allIngredients).sort().forEach(ing => {
//     const label = document.createElement('label');
//     label.innerHTML = `
//       <input type="checkbox" value="${ing}">
//       ${ing}
//     `;
//     filterContainer.appendChild(label);
//   });

//   filterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
//     cb.addEventListener('change', handleFilterChange);
//   });
// }
// function handleFilterChange() {
//   const selected = Array.from(filterContainer.querySelectorAll('input[type="checkbox"]:checked'))
//     .map(cb => cb.value);

//   if (selected.length === 0) {
//     renderRecipes(allRecipes);
//     return;
//   }

//   const filtered = allRecipes.filter(recipe =>
//     selected.some(term =>
//       recipe.ingredients?.some(i => i.toLowerCase().includes(term))
//     )
//   );
//   ;

//   renderRecipes(filtered);
// }
 

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
    .filter(item => item.matchRatio >= 0.4) // min. 40% egyezés kell
    .sort((a, b) => b.matchedCount - a.matchedCount) // legtöbb egyezés előre
    .map(item => item.recipe);

  renderRecipes(filtered);
}
searchInput.addEventListener('input', searchRecipes);
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  renderRecipes(allRecipes);
});
