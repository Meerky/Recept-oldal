document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
  });
});

 window.addEventListener("scroll", () => {
   const header = document.querySelector("header");

   if (window.scrollY > 50) {
     header.classList.add("scrolled");
   } else {
     header.classList.remove("scrolled");
   }
 });


