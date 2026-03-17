// src/lib/providersignup.ts
import { auth, db } from "@/lib/firebase/firebaseClient"; // Verified path
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const handleProviderSignup = async (formData: any) => {
  try {
    // 1. Create auth account using the mapped key from page.tsx
    // Using a fallback check for 'email' just in case
    const email = formData.professional_email || formData.email;
    const password = formData.password;

    if (!email || !password) {
      throw new Error("Email or password is missing.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2. Save provider data in Firestore
    // We use '|| ""' for every field to prevent "Unsupported field value: undefined"
    await setDoc(doc(db, "providers", user.uid), {
      uid: user.uid,
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      professional_email: formData.professional_email || "",
      phone_number: formData.phone_number || "",
      parish: formData.parish || "",
      professional_title: formData.professional_title || "",
      license: formData.license || "",
      specialization: formData.specialization || "",
      experience: formData.experience || "",
      practice_areas: formData.practice_areas || "",
      role: "provider",
      status: "pending", // Default status for admin review
      created_at: serverTimestamp(), // Uses Firebase server time for accuracy
    });

    return { success: true };

  } catch (error: any) {
    console.error("Signup Error Logic:", error);
    // Return the specific Firebase error message to the UI
    return { success: false, error: error.message };
  }
};
