import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // 1️⃣ Felhasználó létrehozása Authentication-ben
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ Admin létrehozva:", user.uid);

      // 2️⃣ Admin mentése Firestore-ba UID alapján
      await setDoc(doc(db, "admin", user.uid), {
        email: email,
        role: "admin",
        uid: user.uid
      });

      alert("Admin sikeresen regisztrálva!");
      form.reset();

    } catch (err) {
      console.error("❌ Hiba regisztrációnál:", err);
      alert("Hiba: " + err.message);
    }
  });
});
