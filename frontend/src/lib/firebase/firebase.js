import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOqeLthlSesuS8zYpVoeOg15g0Csi0Ln8",
  authDomain: "hopepath-7411c.firebaseapp.com",
  projectId: "hopepath-7411c",
  storageBucket: "hopepath-7411c.firebasestorage.app",
  messagingSenderId: "97298252956",
  appId: "1:97298252956:web:5e0c954ecea5ecbec21959",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
