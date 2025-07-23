import { renderRecipes, allRecipes } from './recipe-card.js';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;

      if (category === 'all') {
        renderRecipes(allRecipes);
      } else {
        const filtered = allRecipes.filter(
          (recipe) => recipe.category?.toLowerCase() === category.toLowerCase()
        );
        renderRecipes(filtered);
      }
    });
  });
});
