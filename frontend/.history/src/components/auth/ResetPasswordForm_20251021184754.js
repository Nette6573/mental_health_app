'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('Reset password for:', email)
      // Add your password reset logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Reset password error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
          <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Check your email
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
        </div>
        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() => setIsSubmitted(false)}
          >
            Resend email
          </Button>
          <Link 
            href="/auth/login" 
            className="block text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {/* Email Input */}
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={MailIcon}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center py-3 text-base font-medium"
        loading={loading}
      >
        Send reset link
      </Button>

      {/* Back to Login */}
      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          Back to sign in
        </Link>
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

const CheckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)