'use client'

import { useAuth } from "@/context/AuthContext";
import { createContext, useContext, useState, useEffect } from 'react'
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
import { auth, db } from "@/lib/firebase/firebaseClient";


const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
      }
    }
  }

  // Check if the current path belongs to the provider dashboard
  const isProviderPath = (path) => path.includes('/provider-dashboard')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const path = typeof window !== 'undefined' ? window.location.pathname : ''

        // Providers don't need email verification — let them through on their own routes.
        // Regular users on non-provider paths still require email verification.
        if (!firebaseUser.emailVerified && !isProviderPath(path)) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const appUser = await buildUserFromFirebase(firebaseUser)
        setUser(appUser)

        // Redirect after login only for non-provider paths
        if (!isProviderPath(path)) {
          if (path === '/' || path.includes('/login') || path.includes('/auth')) {
            router.replace('/dashboard')
          }
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  // ----------------------------------
  // EMAIL/PASSWORD LOGIN
  // ----------------------------------
  const login = async (email, password) => {
    try {
      setIsLoading(true)

      const cred = await signInWithEmailAndPassword(auth, email, password)
      const path = typeof window !== 'undefined' ? window.location.pathname : ''

      // Only enforce email verification for regular (non-provider) users
      if (!cred.user.emailVerified && !isProviderPath(path)) {
        await signOut(auth)
        return {
          success: false,
          error: "Please verify your email before signing in.",
        }
      }

      const appUser = await buildUserFromFirebase(cred.user)
      setUser(appUser)

      return { success: true, user: cred.user }
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
  // EMAIL/PASSWORD SIGNUP
  // ----------------------------------
  const signup = async ({ firstName, lastName, email, password, newsletter }) => {
    try {
      setIsLoading(true)

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = cred.user

      await sendEmailVerification(firebaseUser)

      if (firstName || lastName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: `${firstName} ${lastName}`.trim(),
        })
      }

      const userDocRef = doc(db, 'users', firebaseUser.uid)
      await setDoc(
        userDocRef,
        {
          firstName,
          lastName,
          email,
          newsletter: !!newsletter,
          joinDate: new Date().toISOString(),
        },
        { merge: true }
      )

      return {
        success: true,
        message: "A verification link has been sent to your email.",
      }
    } catch (error) {
      console.error('Signup error:', error)
      let message = 'Registration failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') message = 'This email is already in use.'
      else if (error.code === 'auth/weak-password') message = 'Password is too weak.'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

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

  // LOGOUT
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

  // SOCIAL LOGIN
  const loginWithProvider = async (provider) => {
    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      console.log("LOGIN FUNCTION HIT")
      console.log("FIREBASE USER:", firebaseUser)

      localStorage.setItem("uid", firebaseUser.uid)

      await fetch("http://127.0.0.1:8000/api/create-user", {
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

  // UPDATE PROFILE
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
            displayName: `${updates.firstName || user.firstName} ${
              updates.lastName || user.lastName
            }`.trim(),
          })
        }
      }

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // HELPERS
  const isAuthenticated = !!user
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
