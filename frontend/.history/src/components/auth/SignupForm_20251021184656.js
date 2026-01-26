'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import SocialLogin from './SocialLogin'

export default function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
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
    setLoading(true)
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      setLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions')
      setLoading(false)
      return
    }

    try {
      console.log('Signup data:', formData)
      // Add your registration logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Account created successfully!')
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      // Add Google OAuth logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Google signup successful!')
    } catch (error) {
      console.error('Google signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    try {
      // Add Facebook OAuth logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Facebook signup successful!')
    } catch (error) {
      console.error('Facebook signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        placeholder="Create a password"
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
        loading={loading}
      >
        Create account
      </Button>

      {/* Social Signup */}
      <SocialLogin
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={loading}
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