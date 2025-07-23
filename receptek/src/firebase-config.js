 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {

  apiKey: "AIzaSyCvVADfu_BArWZBs9dU59SKo7n2SjLcxhk",

  authDomain: "life-of-leaven.firebaseapp.com",

  projectId: "life-of-leaven",

  storageBucket: "life-of-leaven.firebasestorage.app",

  messagingSenderId: "825863106726",

  appId: "1:825863106726:web:3323f8e23d219ce6c30467",

  measurementId: "G-W6PWRQ8P3Z"

};


export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const db = getFirestore(app); // exportáljuk az adatbázist
export const auth = getAuth(app);