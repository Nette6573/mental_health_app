'use client'

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
import { auth, db, googleProvider, facebookProvider } from "../lib/firebase/firebaseClient"

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
        role: profile.role || "user",
        // ── flag so we know if a Firestore doc actually exists ──
        hasUserDoc: snap.exists(),
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
        hasUserDoc: false,
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {

        // Block unverified email users
        if (!firebaseUser.emailVerified) {
          await signOut(auth)
          setUser(null)
          setIsLoading(false)
          return
        }

        const path = window.location.pathname

        // ── Only restore session if already on a protected page ──
        // Do NOT auto-login from the login or auth pages
        const isLoginPage =
          path === '/' ||
          path.includes('/login') ||
          path.includes('/auth') ||
          path === '/admin'

        if (isLoginPage) {
          // They are on a login page — do not auto-restore session
          // Let them log in manually through the login form
          setUser(null)
          setIsLoading(false)
          return
        }

        // They are already on a protected page (e.g. refreshed the dashboard)
        // Restore their session so they don't get kicked out on refresh
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

      // Return the uid so login pages can check their own collection
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

      // Step 1: Create the Firebase Auth account
      console.log('SIGNUP STEP 1: Creating Firebase Auth account...')
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      firebaseUser = cred.user
      console.log('SIGNUP STEP 1 SUCCESS: Auth account created, uid:', firebaseUser.uid)
      console.log('SIGNUP STEP 1: emailVerified:', firebaseUser.emailVerified)

      // Step 2: Update display name
      console.log('SIGNUP STEP 2: Updating display name...')
      if (firstName || lastName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: `${firstName} ${lastName}`.trim(),
        })
      }
      console.log('SIGNUP STEP 2 SUCCESS: Display name updated')

      // Step 3: Write to Firestore using firebaseUser directly
      // We already have the authenticated user object from Step 1
      // No need to wait for onAuthStateChanged — use firebaseUser directly
      console.log('SIGNUP STEP 3: Writing to Firestore using firebaseUser...')
      console.log('SIGNUP STEP 3: uid =', firebaseUser.uid)

      // Force a fresh token so Firestore recognises the auth session
      await firebaseUser.getIdToken(true)
      console.log('SIGNUP STEP 3: Token refreshed')

      const userDocRef = doc(db, 'users', firebaseUser.uid)
      await setDoc(
        userDocRef,
        {
          firstName,
          lastName,
          email,
          newsletter: !!newsletter,
          joinDate: new Date().toISOString(),
          role: "user",
        },
        { merge: true }
      )
      console.log('SIGNUP STEP 3 SUCCESS: Firestore write complete')

      // Step 4: Send verification email AFTER Firestore write
      console.log('SIGNUP STEP 4: Sending verification email...')
      await sendEmailVerification(firebaseUser)
      console.log('SIGNUP STEP 4 SUCCESS: Verification email sent')

      // Step 5: Sign out so they must verify email before accessing the app
      console.log('SIGNUP STEP 5: Signing out...')
      await signOut(auth)
      console.log('SIGNUP STEP 5 SUCCESS: Signed out')

      return {
        success: true,
        message: "A verification link has been sent to your email.",
      }
    } catch (error) {
      console.error('SIGNUP FAILED at error:')
      console.error('  code:', error.code)
      console.error('  message:', error.message)
      console.error('  full error:', error)

      // If Firestore write failed but Auth account was created, clean up
      if (firebaseUser) {
        try {
          await signOut(auth)
        } catch (e) {
          console.error('Cleanup signOut error:', e)
        }
      }

      let message = 'Registration failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please sign in or use a different email.'
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.'
      } else if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        message = 'Account created but profile could not be saved. Please contact support.'
      }
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
