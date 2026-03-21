import { auth, db } from "./firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const providerSignup = async (formData: any) => {
  try {
    // CREATE AUTH USER
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;

    // 🔥 FORCE CONFIRM USER EXISTS
    if (!user || !user.uid) {
      throw new Error("User not properly created");
    }

    // 🔥 WRITE TO FIRESTORE
    await setDoc(doc(db, "providers", user.uid), {
      ...formData,
      role: "provider",
      created_at: new Date(),
    });

    return { success: true };

  } catch (error: any) {
    console.error("FULL ERROR:", error);
    return { error: error.message || "Unknown error" };
  }
};
