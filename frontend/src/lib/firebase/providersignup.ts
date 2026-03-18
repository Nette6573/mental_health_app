// src/lib/firebase/providersignup.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; // adjust path if needed

/**
 * Sign up a new provider user
 */
export async function providerSignup(email: string, password: string, name: string) {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Create Firestore document in /users
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified,
    });

    // 3. Create Firestore document in /providers
    await setDoc(doc(db, "providers", user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified,
    });

    console.log("User created and Firestore docs written:", user.uid);
    return user;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
}
