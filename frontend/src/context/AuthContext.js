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
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Build our app user object from Firebase user + Firestore profile
  const buildUserFromFirebase = async (firebaseUser) => {
    if (!firebaseUser) return null
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)
      const profile = snap.exists() ? snap.data() : {}

      return {
        id: firebaseUser.uid,
        firstName:
          profile.firstName ||
          (firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] : ''),
        lastName:
          profile.lastName ||
          (firebaseUser.displayName
            ? firebaseUser.displayName.split(' ').slice(1).join(' ')
            : ''),
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

  // ✅ Listen for login / logout / refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase user state changed:', firebaseUser)  // <-- add this line

      if (firebaseUser) {
        const appUser = await buildUserFromFirebase(firebaseUser)
        setUser(appUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // 🔐 Email/password login
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const appUser = await buildUserFromFirebase(cred.user)
      setUser(appUser)
      return { success: true, user: appUser }
    } catch (error) {
      console.error('Login error:', error)
      let message = 'Login failed. Please try again.'

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'Invalid email or password.'
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with that email.'
      }

      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // 📝 Email/password signup
  const signup = async ({ firstName, lastName, email, password, newsletter }) => {
    try {
      setIsLoading(true)
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = cred.user

      // Set displayName in Firebase Auth
      if (firstName || lastName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: `${firstName} ${lastName}`.trim(),
        })
      }

      // Save profile in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const profile = {
        firstName,
        lastName,
        email,
        newsletter: !!newsletter,
        joinDate: new Date().toISOString(),
      }
      await setDoc(userDocRef, profile, { merge: true })

      const appUser = await buildUserFromFirebase(firebaseUser)
      setUser(appUser)
      return { success: true, user: appUser }
    } catch (error) {
      console.error('Signup error:', error)
      let message = 'Registration failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.'
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please choose a stronger password.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // 🚪 Logout
  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 🔁 Password reset
  const resetPassword = async (email) => {
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      let message = 'Failed to send reset email. Please try again.'
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with that email.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // 🌐 Social login helper (Google / Facebook)
  const loginWithProvider = async (provider) => {
    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      const userDocRef = doc(db, 'users', firebaseUser.uid)

      const snap = await getDoc(userDocRef)
      if (!snap.exists()) {
        const [firstName = '', ...rest] = (firebaseUser.displayName || '').split(' ')
        const profile = {
          firstName,
          lastName: rest.join(' '),
          email: firebaseUser.email,
          newsletter: true,
          joinDate: new Date().toISOString(),
        }
        await setDoc(userDocRef, profile)
      }

      const appUser = await buildUserFromFirebase(firebaseUser)
      setUser(appUser)
      return { success: true, user: appUser }
    } catch (error) {
      console.error('Social login error:', error)
      let message = 'Social login failed. Please try again.'
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login popup was closed before finishing.'
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = () => loginWithProvider(googleProvider)
  const loginWithFacebook = () => loginWithProvider(facebookProvider)

  // ✏ Update profile (stored in Firestore)
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

  const getDisplayName = () => {
    if (!user) return 'User'
    return user.firstName + (user.lastName ? ` ${user.lastName}` : '')
  }

  const getInitials = () => {
    if (!user) return 'U'
    const first = user.firstName?.[0] || ''
    const last = user.lastName?.[0] || ''
    return (first + last || user.email?.[0] || 'U').toUpperCase()
  }

  const value = {
    // state
    user,
    isLoading,
    isAuthenticated,

    // actions
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    updateProfile,

    // helpers
    getDisplayName,
    getInitials,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
