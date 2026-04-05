import { auth, db } from "./firebaseClient";
import {
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
  User
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface ProviderSignupData {
  first_name: string;
  last_name: string;
  professional_email: string;
  password: string;
  phone_number: string;
  parish: string;
  professional_title: string;
  license: string;
  specialization: string;
  experience: string;
  practice_areas: string;
}

interface SignupResult {
  user?: User;
  error?: string;
}

export const providerSignup = async (
  formData: ProviderSignupData
): Promise<SignupResult> => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    // ✅ 1. Create Firebase Auth User
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );

    const user = userCredential.user;

    // ✅ 2. Send verification email
    await sendEmailVerification(user);

    // ✅ 3. Ensure token is ready
    await user.getIdToken(true);

    // ✅ 4. OPTIONAL: Save to Firestore (can remove later if unused)
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
      created_at: serverTimestamp(),
      login_location: null,
    });

    console.log("✅ Provider created successfully");

    // 🔥 CRITICAL FIX: RETURN USER
    return {
      user
    };

  } catch (error: unknown) {
    console.error("Detailed Signup Error:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unknown error occurred" };
  }
};