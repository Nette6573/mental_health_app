import { auth, db } from "@/lib/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const handleProviderSignup = async (formData) => {

  try {

    // 1. Create auth account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;

    // 2. Save provider data in Firestore
    await setDoc(doc(db, "providers", user.uid), {
      businessName: formData.businessName,
      email: formData.email,
      role: "provider",
      status: "pending",
      createdAt: new Date()
    });

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  }
};
