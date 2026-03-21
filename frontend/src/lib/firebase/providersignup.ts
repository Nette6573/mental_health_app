import { auth, db } from "./firebaseClient";
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const providerSignup = async (formData: any) => {
  try {
    // 1. FORCE PERSISTENCE (stay signed in)
    await setPersistence(auth, browserLocalPersistence);

    // 2. CREATE AUTH USER
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;
    console.log("Auth UID:", user.uid);

    // 3. ENSURE AUTH SESSION IS ACTIVE
    console.log("Auth currentUser:", auth.currentUser?.uid);

    // 4. SAVE TO FIRESTORE USING UID
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
      login_location: null,
    });

    console.log("Provider doc written successfully!");
    return { success: true };

  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error.message };
  }
};
