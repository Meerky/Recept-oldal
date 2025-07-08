import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
 
/**
 * Bejelentkezés logika Firebase Authentication.
 */
export async function loginUser(email, password) {
  try {
    const cleanEmail = email.trim().toLowerCase(); // 🔄 új változó, nem ütközik

    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;
    console.log("👋 Bejelentkezett:", user.email);

    // 🔍 Role lekérdezése Firestore-ból
    const userQuery = query(collection(db, "admin"), where("email", "==", cleanEmail));
    const querySnapshot = await getDocs(userQuery);

    console.log("🔍 Dokumentum találatok száma:", querySnapshot.docs.length);

    if (querySnapshot.empty) {
      throw new Error("Nem található regisztrációs adat ehhez az emailhez.");
    }

    const userData = querySnapshot.docs[0].data();
    const role = userData.role;

    localStorage.setItem("userRole", role);

    console.log("Sikeres bejelentkezés:", cleanEmail);
    console.log("Szerepkör:", role);

    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = role === "admin" ? "block" : "none";
    });

    document.querySelectorAll(".user-only").forEach((el) => {
      el.style.display = role === "user" ? "block" : "none";
    });

    if (role === "admin") {
      alert("Üdvözöllek, Admin!");
      window.location.href = "/recipe-admin-form.html";
    } else {
      alert("Sikeres bejelentkezés, felhasználóként.");
      window.location.href = "/user.html";
    }

    return user;

  } catch (error) {
    console.error("❌ Hiba bejelentkezés közben:", error);
    alert("Hiba: " + error.message);
  }
}


