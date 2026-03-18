// src/lib/firebase/providersignup.ts
import { auth, db } from "@/lib/firebase/firebaseClient";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const handleProviderSignup = async (formData: any) => {
  console.log("LOG 1: Function triggered with email:", formData.professional_email);

  try {
    if (!auth || !db) {
      console.error("LOG ERROR: Firebase Auth or DB not initialized.");
      return { success: false, error: "Database connection failed." };
    }

    console.log("LOG 2: Attempting to create Auth User...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;
    console.log("LOG 3: Auth Success! UID is:", user.uid);

    // Wait until the auth state is fully propagated
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) return; // wait until currentUser exists

        // Prepare data to save
        const { password, ...dataToSave } = formData;
        const finalData = {
          ...dataToSave,
          uid: currentUser.uid,
          status: "pending",
          created_at: new Date(),
        };

        console.log("LOG 4: Writing to Firestore with payload:", finalData);

        try {
          await setDoc(doc(db, "providers", currentUser.uid), finalData);
          console.log("LOG 5: Firestore Write SUCCESS!");
          unsubscribe(); // stop listening
          resolve({ success: true });
        } catch (firestoreError: any) {
          console.error("🔥 FIRESTORE ERROR:", firestoreError);
          unsubscribe();
          reject({ success: false, error: firestoreError.message });
        }
      });
    });
  } catch (error: any) {
    console.error("LOG CRITICAL ERROR:", error.code, error.message);
    return { success: false, error: error.message };
  }
};
