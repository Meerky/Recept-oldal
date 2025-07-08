import{auth,db} from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function registerUser({email, password, name}){
  if(!email || !password || !name){
    throw new Error("hiányzó mezők !");
  }

  try{
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    const user = userCredential.user;

    await setDoc(doc(db, "admin", user.uid),{
      name,
      email:user.email,
      role: "user",
    });
    console.log("regisztrált és mentett: " , user);
    return user;

  }catch (error){
    console.log("regisztrációs hiba:", error);
    throw error;
  }
  
};

