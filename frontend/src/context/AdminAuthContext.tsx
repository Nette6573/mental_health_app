'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/firebaseClient'

interface AdminUser {
  uid: string
  email: string
  firstName: string
  lastName: string
  accessId: string
  role: string
  isFirstLogin: boolean
}

interface AdminAuthState {
  admin: AdminUser | null
  isLoading: boolean
  error: string | null
}

interface AdminAuthContextType {
  state: AdminAuthState
  login: (email: string, password: string, accessId: string) => Promise<{ success: boolean; error?: string; isFirstLogin?: boolean }>
  logout: () => Promise<void>
  clearError: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    admin: null,
    isLoading: true,
    error: null,
  })
  const router = useRouter()
  const isLoggingIn = useRef(false)

  // ── Restore session on page load ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (isLoggingIn.current) {
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      if (firebaseUser) {
        const path = window.location.pathname
        const isAdminPage = path.startsWith('/admin')

        if (!isAdminPage) {
          setState({ admin: null, isLoading: false, error: null })
          return
        }

        // Verify this firebase user is in the admin collection
        try {
          const adminQuery = query(
            collection(db, 'admin'),
            where('email', '==', firebaseUser.email)
          )
          const snap = await getDocs(adminQuery)

          if (!snap.empty) {
            const adminData = snap.docs[0].data()
            setState({
              admin: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                firstName: adminData.First_name || '',
                lastName: adminData.lastname || '',
                accessId: adminData.access_id || '',
                role: adminData.role || 'admin',
                isFirstLogin: adminData.first_logged_in === '' || adminData.first_logged_in === null,
              },
              isLoading: false,
              error: null,
            })
          } else {
            // Signed into Firebase but not in admin collection — sign out
            await signOut(auth)
            setState({ admin: null, isLoading: false, error: null })
          }
        } catch (err) {
          setState({ admin: null, isLoading: false, error: null })
        }
      } else {
        setState({ admin: null, isLoading: false, error: null })
      }
    })

    return () => unsubscribe()
  }, [])

  // ── Login ──
  const login = async (email: string, password: string, accessId: string) => {
    isLoggingIn.current = true
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('ADMIN LOGIN: Starting login for email:', email.trim())
      console.log('ADMIN LOGIN: Access ID:', accessId.trim())

      // Step 1: Check Firestore admin collection for matching email + access ID
      // First try with email as-is
      const adminQuery = query(
        collection(db, 'admin'),
        where('email', '==', email.trim())
      )
      const adminSnap = await getDocs(adminQuery)

      console.log('ADMIN LOGIN: Firestore query returned', adminSnap.size, 'documents')
      
      // Log what we found for debugging
      adminSnap.docs.forEach(doc => {
        console.log('ADMIN LOGIN: Found doc:', doc.id, 'data:', JSON.stringify(doc.data()))
      })

      if (adminSnap.empty) {
        // Try lowercase as fallback
        const adminQueryLower = query(
          collection(db, 'admin'),
          where('email', '==', email.trim().toLowerCase())
        )
        const adminSnapLower = await getDocs(adminQueryLower)
        console.log('ADMIN LOGIN: Lowercase query returned', adminSnapLower.size, 'docs')
        
        if (adminSnapLower.empty) {
          console.log('ADMIN LOGIN: No admin found with email:', email.trim())
          await notifySupport(email, accessId)
          isLoggingIn.current = false
          setState(prev => ({ ...prev, isLoading: false, error: 'No admin account found with that email.' }))
          return { success: false, error: 'No admin account found with that email.' }
        }
      }

      // Check access ID matches
      const allDocs = adminSnap.empty 
        ? (await getDocs(query(collection(db, 'admin'), where('email', '==', email.trim().toLowerCase())))).docs
        : adminSnap.docs

      const matchingDoc = allDocs.find(doc => {
        const data = doc.data()
        console.log('ADMIN LOGIN: Checking access_id:', data.access_id, 'vs', accessId.trim())
        return data.access_id === accessId.trim()
      })

      if (!matchingDoc) {
        console.log('ADMIN LOGIN: Access ID does not match')
        await notifySupport(email, accessId)
        isLoggingIn.current = false
        setState(prev => ({ ...prev, isLoading: false, error: 'Invalid Access ID.' }))
        return { success: false, error: 'Invalid Access ID.' }
      }

      const adminDoc = matchingDoc
      const adminSnap2 = { docs: [matchingDoc] }

      const adminData = adminDoc.data()
      console.log('ADMIN LOGIN: Matched admin data:', JSON.stringify(adminData))

      // Step 2: Sign in with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)

      // Step 3: Check if first login
      const isFirstLogin = adminData.first_logged_in === '' || adminData.first_logged_in === null

      // Step 4: If not first login, update last login timestamp
      if (!isFirstLogin) {
        await updateDoc(doc(db, 'admin', adminDoc.id), {
          last_login: new Date().toISOString(),
        })
      }

      const adminUser: AdminUser = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        firstName: adminData.First_name || '',
        lastName: adminData.lastname || '',
        accessId: adminData.access_id || '',
        role: adminData.role || 'admin',
        isFirstLogin,
      }

      setState({ admin: adminUser, isLoading: false, error: null })
      isLoggingIn.current = false

      return { success: true, isFirstLogin }
    } catch (error: any) {
      isLoggingIn.current = false
      console.error('Admin login error:', error.code, error.message)

      let message = 'Login failed. Please check your credentials.'
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.'
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with that email.'
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.'
      }

      setState(prev => ({ ...prev, isLoading: false, error: message }))
      return { success: false, error: message }
    }
  }

  // ── Notify support of failed login attempt ──
  const notifySupport = async (email: string, accessId: string) => {
    try {
      await fetch('/api/admin/notify-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          accessId,
          timestamp: new Date().toISOString(),
          message: `Failed admin login attempt with email: ${email} and Access ID: ${accessId}`,
        }),
      })
    } catch (e) {
      console.error('Failed to notify support:', e)
    }
  }

  // ── Logout ──
  const logout = async () => {
    try {
      await signOut(auth)
      setState({ admin: null, isLoading: false, error: null })
      router.replace('/admin')
    } catch (error) {
      console.error('Admin logout error:', error)
    }
  }

  const clearError = () => setState(prev => ({ ...prev, error: null }))

  return (
    <AdminAuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}
