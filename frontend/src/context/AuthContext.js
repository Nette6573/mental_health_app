'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from "../lib/firebase/firebaseClient"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isSigningUp = useRef(false) // flag to pause onAuthStateChanged during signup

  const buildUserFromFirebase = async (firebaseUser) => {
    if (!firebaseUser) return null
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)
      const profile = snap.exists() ? snap.data() : {}

      return {
        id: firebaseUser.uid,
        firstName: profile.firstName || (firebaseUser.displayName?.split(' ')[0] || ''),
        lastName: profile.lastName || (firebaseUser.displayName?.split(' ').slice(1).join(' ') || ''),
        email: firebaseUser.email,
        avatar: profile.avatar || firebaseUser.photoURL || null,
        joinDate: profile.joinDate || firebaseUser.metadata?.creationTime || null,
        newsletter: profile.newsletter ?? false,
        role: profile.role || "user",
      }
    } catch (err) {
      console.error('Error building user from Firebase:', err)
      return {
        id: firebaseUser.uid,
        firstName: firebaseUser.displayName || '',
        lastName: '',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || null,
        joinDate: firebaseUser.metadata?.creationTime || null,
        newsletter: false,
        role: "user",
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {

        // Skip during signup — signup manages its own auth state
        if (isSigningUp.current) {
          setIsLoading(false)
          return
        }

        const path = window.location.pathname

        // Skip ALL checks for admin pages — AdminAuthContext handles admin auth
        if (path.startsWith('/admin')) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Block unverified email users (non-admin only)
        if (!firebaseUser.emailVerified) {
          await signOut(auth)
          setUser(null)
          setIsLoading(false)
          return
        }

        // ── Do NOT auto-restore session on login/auth pages ──
        // Each login page handles its own redirect after checking
        // the correct Firestore collection (users or providers)
        const isLoginPage =
          path === '/' ||
          path.includes('/login') ||
          path.includes('/auth') ||
          path.startsWith('/admin')

        if (isLoginPage) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Already on a protected page (e.g. refreshed dashboard)
        // Restore session so they don't get kicked out
        const appUser = await buildUserFromFirebase(firebaseUser)
        setUser(appUser)

      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  // ----------------------------------
  // LOGIN
  // ----------------------------------
  const login = async (email, password) => {
    try {
      setIsLoading(true)

      const cred = await signInWithEmailAndPassword(auth, email, password)

      if (!cred.user.emailVerified) {
        await signOut(auth)
        setUser(null)
        return {
          success: false,
          error: "Please verify your email before signing in.",
        }
      }

      const appUser = await buildUserFromFirebase(cred.user)
      setUser(appUser)

      return { success: true, user: cred.user, uid: cred.user.uid }
    } catch (error) {
      console.error('Login error:', error)
      let message = 'Login failed. Please try again.'
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.'
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with that email.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------------------
  // SIGNUP
  // ----------------------------------
  const signup = async ({ firstName, lastName, email, password, newsletter }) => {
    let firebaseUser = null
    try {
      setIsLoading(true)
      isSigningUp.current = true // pause onAuthStateChanged interference

      // Step 1: Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      firebaseUser = cred.user

      // Step 2: Update display name
      if (firstName || lastName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: `${firstName} ${lastName}`.trim(),
        })
      }

      // Step 3: Write to Firestore
      // setDoc WITHOUT merge:true = pure CREATE operation
      // merge:true causes Firestore to evaluate update rules too, which fails
      // Small delay ensures auth token is fully propagated before the write
      await new Promise(resolve => setTimeout(resolve, 500))

      const userDocRef = doc(db, 'users', firebaseUser.uid)
      await setDoc(userDocRef, {
        firstName,
        lastName,
        email,
        newsletter: !!newsletter,
        joinDate: new Date().toISOString(),
        role: "user",
      })

      // Step 4: Send verification email
      await sendEmailVerification(firebaseUser)

      // Step 5: Sign out — they must verify email before logging in
      isSigningUp.current = false // re-enable onAuthStateChanged
      await signOut(auth)

      return {
        success: true,
        message: "A verification link has been sent to your email.",
      }
    } catch (error) {
      console.error('Signup error:', error.code, error.message)
      isSigningUp.current = false // re-enable on error too

      if (firebaseUser) {
        try { await signOut(auth) } catch (e) {}
      }

      let message = 'Registration failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please sign in or use a different email.'
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------------------
  // RESET PASSWORD
  // ----------------------------------
  const resetPassword = async (email) => {
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email.trim())
      return {
        success: true,
        message: 'Password reset email sent. Check your inbox.',
      }
    } catch (error) {
      console.error('Reset password error:', error)
      let message = 'Failed to send password reset email.'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------------------
  // LOGOUT
  // ----------------------------------
  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
      setUser(null)
      router.replace('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------------------
  // SOCIAL LOGIN
  // ----------------------------------
  const loginWithProvider = async (provider) => {
    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      localStorage.setItem("uid", firebaseUser.uid)

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        })
      })

      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)

      if (!snap.exists()) {
        const [firstName = '', ...rest] = (firebaseUser.displayName || '').split(' ')
        await setDoc(userDocRef, {
          firstName,
          lastName: rest.join(' '),
          email: firebaseUser.email,
          newsletter: true,
          joinDate: new Date().toISOString(),
          role: "user",
        })
      }

      const appUser = await buildUserFromFirebase(firebaseUser)
      setUser(appUser)
      router.replace('/dashboard')

      return { success: true, user: appUser }
    } catch (error) {
      console.error('Social login error:', error)
      let message = 'Social login failed. Please try again.'
      if (error.code === 'auth/popup-closed-by-user') message = 'Login popup closed before finishing.'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = () => loginWithProvider(googleProvider)
  const loginWithFacebook = () => loginWithProvider(facebookProvider)

  // ----------------------------------
  // UPDATE PROFILE
  // ----------------------------------
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    try {
      const userDocRef = doc(db, 'users', user.id)
      await setDoc(userDocRef, updates, { merge: true })

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      if (updates.firstName || updates.lastName) {
        const firebaseUser = auth.currentUser
        if (firebaseUser) {
          await firebaseUpdateProfile(firebaseUser, {
            displayName: `${updates.firstName || user.firstName} ${updates.lastName || user.lastName}`.trim(),
          })
        }
      }

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const isAuthenticated = !!user
  const isProvider = user?.role === "provider"
  const isUser = user?.role === "user"

  const getDisplayName = () =>
    user ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : 'User'

  const getInitials = () =>
    user ? ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() : 'U'

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isProvider,
        isUser,
        login,
        signup,
        resetPassword,
        logout,
        updateProfile,
        loginWithGoogle,
        loginWithFacebook,
        getDisplayName,
        getInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
