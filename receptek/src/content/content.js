 import { db } from '../firebase-config.js';
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
  console.log('Lekért receptek:', allRecipes);

  renderRecipes(allRecipes);
  
}

function renderRecipes(recipes) {
  // const container = document.getElementById('recipes-container');
  // container.innerHTML = '';

  const toc = document.getElementById('content-table');
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
 
  });
}
 
fetchRecipes(); 
 

 
 