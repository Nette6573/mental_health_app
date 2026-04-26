"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { User } from "firebase/auth"
import { UserProfile, MoodEntry, Session, JournalEntry } from "./use-user"

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  providers: number
  admins: number
}

export interface AdminUsersData {
  users: UserProfile[]
  stats: AdminStats
}

export interface UserDetails {
  user: UserProfile
  moodEntries: MoodEntry[]
  sessions: Session[]
  journalEntries: Pick<JournalEntry, "id" | "title" | "mood" | "is_private" | "created_at">[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to fetch data")
  }
  return res.json()
}

export function useAdmin() {
  const [authData, setAuthData] = useState<{ user: User; isAdmin: boolean } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setAuthData(null)
          setAuthLoading(false)
          return
        }

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          const userData = userDoc.data()
          
          setAuthData({
            user,
            isAdmin: userData?.role === "admin",
          })
        } catch (error) {
          console.error("Error checking admin status:", error)
          setAuthData({ user, isAdmin: false })
        } finally {
          setAuthLoading(false)
        }
      },
      (error) => {
        setAuthError(error)
        setAuthLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const isAdmin = authData?.isAdmin ?? false
  const userId = authData?.user?.uid

  // Fetch all users from MongoDB (only if admin)
  const { data: usersData, error: usersError, mutate: mutateUsers } = useSWR<AdminUsersData>(
    isAdmin ? "/api/admin/users" : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  )

  const updateUser = async (id: string, updates: { role?: string; is_active?: boolean }) => {
    const res = await fetch(`/api/admin/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to update user")
    }

    mutateUsers()
    return res.json()
  }

  const getUserDetails = async (id: string): Promise<UserDetails> => {
    const res = await fetch(`/api/admin/user/${id}`)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to fetch user details")
    }
    return res.json()
  }

  return {
    isAdmin,
    isLoading: authLoading,
    isAuthenticated: !!authData?.user,
    users: usersData?.users || [],
    stats: usersData?.stats || { totalUsers: 0, activeUsers: 0, providers: 0, admins: 0 },
    error: authError || usersError,
    updateUser,
    getUserDetails,
    mutateUsers,
  }
}