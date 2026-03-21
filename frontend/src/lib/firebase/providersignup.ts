// lib/firebase/providersignup.ts

import { auth, db } from "./firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const providerSignup = async (formData: any) => {
  try {
    // 1. CREATE AUTH USER
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;

    // 2. SAVE TO FIRESTORE USING UID
    await setDoc(doc(db, "providers", user.uid), {
      first_name: formData.first_name,
      last_name: formData.last_name,
      professional_email: formData.professional_email,
      phone_number: formData.phone_number,
      parish: formData.parish,
      professional_title: formData.professional_title,
      license: formData.license,
      specialization: formData.specialization,
      experience: formData.experience,
      practice_areas: formData.practice_areas,
      role: "provider",
      created_at: new Date(),

      // optional default fields
      login_location: null,
    });

    return { success: true };

  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error.message };
  }
};
