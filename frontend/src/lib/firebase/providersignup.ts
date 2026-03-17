// src/lib/firebase/providersignup.ts
import { auth, db } from "@/lib/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const handleProviderSignup = async (formData: any) => {
  console.log("LOG 1: Function triggered with email:", formData.professional_email);
  
  try {
    // Check if variables exist
    if (!auth || !db) {
      console.error("LOG ERROR: Firebase Auth or DB not initialized. Check your firebaseClient.ts");
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

    // Prepare data
    const { password, ...dataToSave } = formData;

    console.log("LOG 4: Preparing to write to Firestore collection 'providers'...");
    
    // We use a regular Date() here to test if serverTimestamp is the issue
    const finalData = {
      ...dataToSave,
      uid: user.uid,
      status: "pending",
      created_at: new Date() 
    };

    console.log("LOG 5: Final data payload:", finalData);

    // THE MOMENT OF TRUTH
    await setDoc(doc(db, "providers", user.uid), finalData);

    console.log("LOG 6: Firestore Write SUCCESS!");
    return { success: true };

  } catch (error: any) {
    console.error("LOG CRITICAL ERROR:", error.code, error.message);
    return { success: false, error: error.message };
  }
};
