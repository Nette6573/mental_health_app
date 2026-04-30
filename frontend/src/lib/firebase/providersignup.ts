import { auth, db } from "./firebaseClient";
import {
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
  signOut,
  User
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Global flag — prevents AuthContext onAuthStateChanged from
// signing out the provider during the signup Firestore write
export let isProviderSigningUp = false;

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
  role?: string;
}

interface SignupResult {
  user?: User;
  error?: string;
}

export const providerSignup = async (
  formData: ProviderSignupData
): Promise<SignupResult> => {
  let user: User | null = null;

  try {
    // Set global flag so AuthContext skips the unverified email sign-out
    isProviderSigningUp = true;

    await setPersistence(auth, browserLocalPersistence);

    // Step 1: Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.professional_email,
      formData.password
    );
    user = userCredential.user;

    // Step 2: Force token refresh so request.auth is populated in Firestore rules
    await user.getIdToken(true);

    // Step 3: Small delay to ensure auth token propagates
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 4: Write to Firestore while still authenticated
    // Must happen BEFORE sending verification email and signing out
    await setDoc(doc(db, "providers", user.uid), {
      first_name: formData.first_name,
      last_name: formData.last_name,
      professional_email: formData.professional_email,
      phone_number: formData.phone_number,   // ← fixed corrupted hyperlink
      parish: formData.parish,
      professional_title: formData.professional_title,
      license: formData.license,
      specialization: formData.specialization,
      experience: formData.experience,
      practice_areas: formData.practice_areas,
      role: "provider",
      is_accepting_clients: false,
      application_status: "pending",
      created_at: serverTimestamp(),
      login_location: null,
    });

    console.log("✅ Provider Firestore document created");

    // Step 5: Clear flag — Firestore write is done
    isProviderSigningUp = false;

    // Step 6: Send verification email
    await sendEmailVerification(user);

    // Step 7: Sign out — provider must verify email before logging in
    await signOut(auth);

    console.log("✅ Provider signup complete");

    return { user };

  } catch (error: unknown) {
    console.error("Detailed Signup Error:", error);

    // Clear flag and clean up
    isProviderSigningUp = false;
    if (user) {
      try { await signOut(auth); } catch (e) {}
    }

    if (error instanceof Error) {
      // Give clearer messages for common Firebase errors
      const code = (error as any).code;
      if (code === 'auth/email-already-in-use') {
        return { error: 'This email is already registered. Please sign in instead.' };
      }
      if (code === 'auth/weak-password') {
        return { error: 'Password is too weak. Please use at least 6 characters.' };
      }
      if (code === 'permission-denied') {
        return { error: 'Failed to save provider data. Please try again.' };
      }
      return { error: error.message };
    }
    return { error: "Unknown error occurred" };
  }
};
