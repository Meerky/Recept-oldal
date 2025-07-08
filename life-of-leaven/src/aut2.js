  import {registerUser} from "./handlers/registerHandler.js";
import { loginUser } from "./handlers/loginHandler.js";
import { auth } from "./firebase.js";
document.addEventListener("DOMContentLoaded", () => {
  
   const registrationForm = document.getElementById("registration-form");

   if(registrationForm){
     registrationForm.addEventListener("submit", async function (e){
       e.preventDefault();

       const name = document.getElementById('name').value.trim();
       const email = document.getElementById('email').value.trim();
       const password = document.getElementById('password').value;

       try{
         await registerUser({email,password,name});
         alert("Sikeres regisztráció");
         registrationForm.reset()
       } catch(error){
         alert("Hiba:" +error.message);
       }
     });
   }

   //login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        await loginUser(email, password);
    
        // window.location.href = "ujodal.html";
      } catch (error) {
        alert("Hiba: " + error.message);
      }
    });
  }



});