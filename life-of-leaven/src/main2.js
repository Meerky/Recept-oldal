import './style.css';
 
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

let allRecipes = [];

const container = document.getElementById('recipes-container');
const filterContainer = document.getElementById('ingredient-filters');
const searchInput = document.getElementById('searchInput');
const resetButton = document.getElementById('resetButton');
const toc = document.getElementById('toc');

// 🔁 Fő receptlekérés Firebase-ből
async function fetchRecipes() {
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  allRecipes = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  renderRecipes(allRecipes);
  renderIngredientFilters(allRecipes);
  updateTOC(allRecipes);
}

// 📄 Receptkártyák kirajzolása
function renderRecipes(recipes) {
  container.innerHTML = '';

  recipes.forEach((data, index) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    const anchorId = `recipe-${data.id || index}`;
    card.id = anchorId;

    const image = document.createElement('img');
    image.classList.add('images');
    image.src = data.imageUrl || 'placeholder.jpg';
    image.alt = data.title;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const title = document.createElement('h2');
    title.textContent = data.title;

    const desc = document.createElement('p');
    desc.classList.add('description');
    desc.textContent = data.description;

    const ingredients = document.createElement('p');
    ingredients.classList.add('ingredients');
    ingredients.textContent = "Alapanyagok: ` ${data.ingredients?.slice(0, 3).join(', ') || 'nincs adat'}...`";
   
    const detailsBtn = document.createElement('a');
    detailsBtn.classList.add('details-btn');
    detailsBtn.textContent = 'Részletek';
    detailsBtn.href = `/recipe.html?id=${data.id}`;

    wrapper.appendChild(title);
    wrapper.appendChild(desc);
    wrapper.appendChild(ingredients);
    wrapper.appendChild(detailsBtn);

    card.appendChild(image);
    card.appendChild(wrapper);
    container.appendChild(card);
  });
}

// 🧭 Tartalomjegyzék (TOC) frissítése – csak egyszer, a teljes listával!
function updateTOC(recipes) {
  toc.innerHTML = '';
  recipes.forEach((data, index) => {
    const anchorId = `recipe-${data.id || index}`;
    const tocItem = document.createElement('li');
    const tocLink = document.createElement('a');
    tocLink.href = `#${anchorId}`;
    tocLink.textContent = data.title;
    tocItem.appendChild(tocLink);
    toc.appendChild(tocItem);
  });
}

// ✅ Alapanyag-szűrők létrehozása
function renderIngredientFilters(recipes) {
  filterContainer.innerHTML = '';
  const allIngredients = new Set();

  recipes.forEach(r => {
    (r.ingredients || []).forEach(i => allIngredients.add(i.toLowerCase()));
  });

  Array.from(allIngredients).sort().forEach(ing => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${ing}"> ${ing}
    `;
    filterContainer.appendChild(label);
  });

  filterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', handleFilterChange);
  });
}

// 🧪 Szűrés checkbox alapján
function handleFilterChange() {
  const selected = Array.from(filterContainer.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  const filtered = selected.length === 0
    ? allRecipes
    : allRecipes.filter(recipe =>
        selected.some(term =>
          recipe.ingredients?.some(i => i.toLowerCase().includes(term))
        )
      );

  renderRecipes(filtered);
  // TOC-ot NEM frissítünk itt!
}

// 🔍 Keresés címre vagy alapanyagra
searchInput.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase().trim();
  const searchTerms = value.split(',').map(term => term.trim()).filter(Boolean);

  const filtered = allRecipes.filter(recipe => {
    const titleMatch = recipe.title?.toLowerCase().includes(value);
    const ingredientsMatch = searchTerms.some(term =>
      recipe.ingredients?.some(i => i.toLowerCase().includes(term))
    );
    return titleMatch || ingredientsMatch;
  });

  renderRecipes(filtered);
  // TOC-ot itt sem frissítünk!
});

// 🔄 Szűrők és keresés visszaállítása
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  filterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  renderRecipes(allRecipes);
  // TOC-ot nem kell újra renderelni
});

// 🪄 Alapanyag szűrőpanel elrejtése/megjelenítése
document.getElementById('toggleFilter').addEventListener('click', () => {
  filterContainer.classList.toggle('hidden');
});

// 🔁 Indítás
fetchRecipes();
