'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import SocialLogin from './SocialLogin'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
  })
  const [error, setError] = useState('')
  
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      newsletter: formData.newsletter
    })
    
    if (result.success) {
      // Redirect to dashboard on successful signup
      router.push('/dashboard')
    } else {
      setError(result.error)
    }
  }

  const handleGoogleLogin = async () => {
    // Implement Google OAuth
    console.log('Google signup clicked')
  }

  const handleFacebookLogin = async () => {
    // Implement Facebook OAuth
    console.log('Facebook signup clicked')
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

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          required
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          label="Last name"
          name="lastName"
          type="text"
          autoComplete="family-name"
          required
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

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
        autoComplete="new-password"
        required
        placeholder="Create a password (min. 6 characters)"
        value={formData.password}
        onChange={handleChange}
        icon={LockIcon}
      />

      {/* Confirm Password */}
      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        icon={LockIcon}
      />

      {/* Terms and Newsletter */}
      <div className="space-y-4">
        <Checkbox
          name="acceptTerms"
          label={
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </Link>
            </span>
          }
          required
          checked={formData.acceptTerms}
          onChange={handleChange}
        />
        <Checkbox
          name="newsletter"
          label="Send me mental health resources and updates"
          checked={formData.newsletter}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center py-3 text-base font-medium"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>

      {/* Social Signup */}
      <SocialLogin
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={isLoading}
      />

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link 
            href="/auth/login" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}

// Icons (same as login)
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