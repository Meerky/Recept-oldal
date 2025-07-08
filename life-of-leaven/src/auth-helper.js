import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase.js';

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('✅ Be van jelentkezve:', user.email);
    console.log('🆔 UID:', user.uid);
    window.loggedInUser = user; // Globális, hogy a konzolban is elérhető legyen
  } else {
    console.log('❌ Nincs bejelentkezve.');
    window.loggedInUser = null;
  }
});
