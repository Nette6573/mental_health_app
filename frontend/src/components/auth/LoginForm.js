'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/LandingButton'
import Checkbox from '@/components/ui/Checkbox'
import SocialLogin from './SocialLogin'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')

  const { login, loginWithGoogle, loginWithFacebook, isLoading } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await login(formData.email, formData.password)

    if (!result.success) {
      setError(result.error)
      return
    }

    // Block unverified email users
    if (!result.user.emailVerified) {
      setError('Please verify your email before logging in. Check your inbox or spam folder.')
      return
    }

    // ── Check if this person exists in the users collection ──
    const userSnap = await getDoc(doc(db, 'users', result.uid))
    if (!userSnap.exists()) {
      setError('No user account found. Please sign up first or log in as a Service Provider.')
      return
    }

    // All good — go to user dashboard
    router.push('/dashboard')
  }

  const handleGoogleLogin = async () => {
    setError('')
    const result = await loginWithGoogle()
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const handleFacebookLogin = async () => {
    setError('')
    const result = await loginWithFacebook()
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Tip</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">You can also sign in using Google or Facebook below.</p>
          </div>
        </div>
      </div>

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        icon={MailIcon}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        icon={LockIcon}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          name="rememberMe"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        <Link href="/auth/reset-password" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center py-3 text-base font-medium"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <SocialLogin
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={isLoading}
      />

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {"Don't have an account?"}{' '}
          <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <Link href="/provider-dashboard/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Log In as a Service Provider
          </Link>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <Link href="/admin" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Log In as an Admin
          </Link>
        </p>
      </div>
    </form>
  )
}

const MailIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const LockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)
