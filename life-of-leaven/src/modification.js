import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { handleDelete } from './recipe-delete.js';
import { handleEdit } from './recipe-edit.js';

const tableBody = document.getElementById('recipeTableBody');

async function fetchAndDisplayRecipes() {
  const q = query(collection(db, 'recipes'), orderBy('title'));
  const querySnapshot = await getDocs(q);
  tableBody.innerHTML = '';

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${data.title}</td>
      <td>${data.category}</td>
      <td>${data.description}</td>
      <td>${Array.isArray(data.ingredients) ? data.ingredients.join(', ') : data.ingredients}</td>
      <td>${data.description}</td>
      <td>${Array.isArray(data.steps) ? data.steps.join('<br>') : data.steps}</td>
      <td><a href="${data.imageUrl}" target="_blank">Link</a></td>
      <td>
        <button class="edit-btn" data-id="${docSnap.id}">✏️</button>
        <button class="delete-btn" data-id="${docSnap.id}">🗑️</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  addEventListeners();
}


function addEventListeners() {
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      handleDelete(id, fetchAndDisplayRecipes);
    });
  });

  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      handleEdit(id);
    });
  });
}

fetchAndDisplayRecipes();
