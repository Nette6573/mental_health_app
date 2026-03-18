import { auth, db } from "@/lib/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const handleProviderSignup = async (formData: any) => {
  console.log("LOG 1: Function triggered with email:", formData.professional_email);
  
  try {
    if (!auth || !db) {
      console.error("LOG ERROR: Firebase not initialized");
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

    // 🔥 FIX: wait for auth to sync
    await auth.currentUser?.reload();
    console.log("AUTH READY UID:", auth.currentUser?.uid);

    const { password, ...dataToSave } = formData;

    const finalData = {
      ...dataToSave,
      uid: user.uid,
      status: "pending",
      created_at: new Date()
    };

    console.log("LOG 5: Final data payload:", finalData);

    // 🔥 FIX: proper error capture
    try {
      await setDoc(doc(db, "providers", user.uid), finalData);
      console.log("LOG 6: Firestore Write SUCCESS!");
    } catch (firestoreError: any) {
      console.error("🔥 FIRESTORE ERROR:", firestoreError.code, firestoreError.message);
      throw firestoreError;
    }

    return { success: true };

  } catch (error: any) {
    console.error("LOG CRITICAL ERROR:", error.code, error.message);
    return { success: false, error: error.message };
  }
};
