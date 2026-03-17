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
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      parish: formData.parish,
      title: formData.title,
      license: formData.license,
      specialization: formData.specialization,
      experience: formData.experience,
      practiceAreas: formData.practiceAreas,
      role: "provider",
      status: "pending",
      createdAt: new Date()
    });

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  }
};
