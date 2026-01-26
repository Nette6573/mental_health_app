'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import SocialLogin from './SocialLogin'
// import your login function if you have it
// import { login } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // now defined

    try {
      // Simulate login function (replace with your actual login logic)
      const result = await fakeLogin(formData.email, formData.password)

      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Google login successful!')
    } catch (error) {
      console.error('Google login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Facebook login successful!')
    } catch (error) {
      console.error('Facebook login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Input */}
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

      {/* Password Input */}
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          name="rememberMe"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        <Link 
          href="/auth/reset-password" 
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center py-3 text-base font-medium"
        loading={loading}
      >
        Sign in
      </Button>

      {/* Social Login */}
      <SocialLogin
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={loading}
      />

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}

// Icons
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

// Temporary login simulation
async function fakeLogin(email, password) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (email === 'admin@example.com' && password === 'password') {
    return { success: true }
  } else {
    return { success: false, error: 'Invalid email or password' }
  }
}
