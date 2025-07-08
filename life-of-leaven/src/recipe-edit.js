// src/recipe-edit.js
// export function handleEdit(id) {
//   console.log('Szerkesztés ID:', id);
//   // TODO: modal nyitása vagy űrlap betöltése a kiválasztott recepttel
//   alert(`Szerkesztés még nincs implementálva. ID: ${id}`);
// }


// src/recipe-edit.js
import { db } from './firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModalBtn = document.getElementById('closeModal');

export async function handleEdit(id) {
  const docRef = doc(db, 'recipes', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // Mezők kitöltése
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = data.title || '';
    document.getElementById('editImageUrl').value = data.imageUrl || '';
    document.getElementById('editCategory').value = data.category || '';
    document.getElementById('editDescription').value = data.description || '';
    document.getElementById('editIngredients').value = Array.isArray(data.ingredients) ? data.ingredients.join(', ') : data.ingredients || '';
    document.getElementById('editSteps').value = Array.isArray(data.steps) ? data.steps.join(', ') : data.steps || '';

    modal.classList.add('active');
  } else {
    alert('Nem található a recept.');
  }
}

// Bezárás gomb
closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Mentés
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;

  const updatedData = {
    title: document.getElementById('editTitle').value,
    imageUrl: document.getElementById('editImageUrl').value,
    category: document.getElementById('editCategory').value,
    description: document.getElementById('editDescription').value,
    ingredients: document.getElementById('editIngredients').value.split(',').map(i => i.trim()),
    steps: document.getElementById('editSteps').value.split(',').map(s => s.trim()),
  };

  try {
    await updateDoc(doc(db, 'recipes', id), updatedData);
    alert('Recept frissítve.');
    modal.classList.remove('active');
    location.reload(); // vagy callback a frissítéshez
  } catch (err) {
    alert('Nem sikerült menteni a módosításokat.');
    console.error('Update hiba:', err);
  }
});
