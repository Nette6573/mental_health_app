import { auth, db } from "./firebaseClient";
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

export const providerSignup = async (formData: any) => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    // 1. Create the Auth User
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;
    //send verfication email to user
    await sendEmailVerification(user);
    // 2. CRITICAL FIX: Force the SDK to recognize the user
    // This waits for the token to be generated and attaches it to the client
    await user.getIdToken(true);

    // 3. SECURE WRITE: Write to Firestore
    // Using user.uid here ensures it matches the rule match /providers/{providerId}
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
      created_at: serverTimestamp(), // Use serverTimestamp for database consistency
      login_location: null,
    });

    console.log("Provider doc written successfully!");
    return { success: true };

  } catch (error: any) {
    console.error("Detailed Signup Error:", error.code, error.message);
    return { error: error.message };
  }
};
