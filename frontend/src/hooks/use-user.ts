"use client"

import useSWR from "swr"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { useState, useEffect, useCallback } from "react"

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: "user" | "provider" | "admin"
  faith_based_enabled: boolean
  notifications_enabled: boolean
  mood_reminders_enabled: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  mood: "great" | "good" | "okay" | "low" | "struggling"
  energy_level: number | null
  sleep_quality: number | null
  anxiety_level: number | null
  notes: string | null
  activities: string[] | null
  logged_at: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: string | null
  is_private: boolean
  prompt: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  therapist_id: string
  scheduled_at: string
  duration_minutes: number
  type: "video" | "in-person" | "phone"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes: string | null
  therapist: {
    id: string
    name: string
    title: string
    avatar_url: string | null
  }
}

export interface UserData {
  user: UserProfile
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
  sessions: Session[]
}

const fetcher = async (url: string): Promise<UserData> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export function useUser() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<Error | null>(null)

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthUser(user)
        setAuthLoading(false)
      },
      (error) => {
        setAuthError(error)
        setAuthLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const userId = authUser?.uid

  // Fetch user data from MongoDB via API
  const { data: userData, error: userError, mutate } = useSWR<UserData>(
    userId ? `/api/user/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return

    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      throw new Error("Failed to update profile")
    }

    mutate()
    return res.json()
  }

  const logMood = async (moodData: {
    mood: MoodEntry["mood"]
    energy_level?: number
    sleep_quality?: number
    anxiety_level?: number
    notes?: string
    activities?: string[]
  }) => {
    if (!userId) return

    const res = await fetch(`/api/user/${userId}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(moodData),
    })

    if (!res.ok) {
      throw new Error("Failed to log mood")
    }

    mutate()
    return res.json()
  }

  const signOut = useCallback(async () => {
    await auth.signOut()
    mutate(undefined, { revalidate: false })
  }, [mutate])

  return {
    user: userData?.user,
    moodEntries: userData?.moodEntries || [],
    journalEntries: userData?.journalEntries || [],
    sessions: userData?.sessions || [],
    isLoading: authLoading || (!userError && !userData && !!userId),
    isAuthenticated: !!authUser && !authError,
    authUser,
    error: authError || userError,
    updateProfile,
    logMood,
    signOut,
    mutate,
  }
}