import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

// 1️⃣ Kiolvassuk az ID-t az URL-ből
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');

// 2️⃣ Lekérjük a receptet Firestore-ból
async function loadRecipe() {
  const container = document.getElementById('recipe-detail');

  if (!recipeId) {
    container.innerHTML = '<p>Recept nem található.</p>';
    return;
  }

  try {
    const docRef = doc(db, 'recipes', recipeId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      container.innerHTML = '<p>Recept nem található.</p>';
      return;
    }

    const recipe = docSnap.data();

    // 3️⃣ Hozzávalók és lépések listázása
    const ingredientsHTML = (recipe.ingredients || []).map(ing => `<li>${ing}</li>`).join('');
    const stepsHTML = (recipe.steps || []).map((step, i) => `<li><strong>${i + 1}.</strong> ${step}</li>`).join('');

    // 4️⃣ HTML sablon
    container.innerHTML = `
      <h1>${recipe.title}</h1>
      <img src="${recipe.imageUrl || 'placeholder.jpg'}" alt="${recipe.title}" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;">
      <p><strong>Kategória:</strong> ${recipe.category || 'Nincs megadva'}</p>
      <p><strong>Leírás:</strong> ${recipe.description || ''}</p>

      <h2>Hozzávalók</h2>
      <ul>${ingredientsHTML}</ul>

      <h2>Elkészítés</h2>
      <ol>${stepsHTML}</ol>

       <div style="margin-top: 2rem;">
    <a href="recipe.html" style="display: inline-block; padding: 0.5rem 1rem; background: #f57c00; color: white; text-decoration: none; border-radius: 5px;">⬅ Vissza a listához</a>
  </div>
    `;
  } catch (error) {
    console.error('Hiba a recept betöltésekor:', error);
    container.innerHTML = '<p>Hiba történt a betöltés során.</p>';
  }
}

loadRecipe();
