// src/recipe-delete.js
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';

export async function handleDelete(id, callback) {
  const confirmed = confirm('Biztosan törlöd ezt a receptet?');
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, 'recipes', id));
    callback?.(); // újratöltés vagy frissítés
  } catch (error) {
    alert('Hiba történt a törléskor');
    console.error('Törlés hiba:', error);
  }
}
// project-825863106726