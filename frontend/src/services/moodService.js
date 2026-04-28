import { db } from "@/lib/firebase/firebaseClient";
import {
  collection, addDoc, getDocs,
  query, orderBy, serverTimestamp
} from "firebase/firestore";

// Save a mood entry to Firestore
export async function saveMood(userId, moodData) {
  const moodRef = collection(db, "users", userId, "mood_entries");
  await addDoc(moodRef, {
    mood: moodData.mood,
    note: moodData.note || "",
    activities: moodData.activities || [],
    emotions: moodData.emotions || [],
    sleepHours: moodData.sleepHours || 0,
    stressLevel: moodData.stressLevel || 0,
    date: moodData.date || new Date().toISOString(),
    createdAt: serverTimestamp(),
  });
}

// Get all mood entries for a user
export async function getMood(userId) {
  const moodRef = collection(db, "users", userId, "mood_entries");
  const q = query(moodRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  const mood_log = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Normalize date field
    date: doc.data().date || doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  }));

  return { mood_log };
}
