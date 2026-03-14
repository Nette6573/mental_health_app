'use client'

import { useState, useRef, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { 
  KeyIcon, 
  ArrowPathIcon, 
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function TwoFactorAuth() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const [showBackupOption, setShowBackupOption] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyTwoFactor, state } = useAdminAuth()

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()

    // Countdown timer
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (i < 6) newCode[i] = char
      })
      setCode(newCode)
      
      // Focus last filled input
      const lastFilledIndex = Math.min(pastedCode.length - 1, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    } else {
      // Handle single digit
      if (/^\d*$/.test(value)) {
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all digits are entered
        if (index === 5 && value) {
          const fullCode = [...newCode.slice(0, 5), value].join('')
          if (fullCode.length === 6) {
            handleSubmit(new Event('submit') as any)
          }
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const pastedCode = pastedData.slice(0, 6).split('').filter(char => /^\d$/.test(char))
    
    if (pastedCode.length > 0) {
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (i < 6) newCode[i] = char
      })
      setCode(newCode)
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newCode.findIndex((val, i) => !val && i < 6)
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      await verifyTwoFactor(fullCode)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    // Simulate resend API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTimer(60)
    setIsResending(false)
    // Show success message
    alert('A new verification code has been sent to your authenticator app.')
  }

  const handleBackupCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (backupCode.trim()) {
      await verifyTwoFactor(backupCode.trim())
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShieldCheckIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
            <KeyIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Enter the 6-digit verification code from your authenticator app to complete the sign-in process.
        </p>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!showBackupOption ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              Verification Code
            </label>
            <div 
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold 
                           border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 
                           focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200"
                  autoComplete="off"
                  disabled={state.isLoading}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Enter the 6-digit code from your Google Authenticator or Authy app
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={code.join('').length !== 6 || state.isLoading}
            className="w-full py-3 px-4 bg-primary-500 text-white font-medium rounded-lg 
                       hover:bg-primary-600 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {state.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify & Sign In'
            )}
          </button>

          {/* Resend Options */}
          <div className="text-center space-y-2">
            {timer > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive a code? Resend in{' '}
                <span className="font-mono font-medium text-primary-600 dark:text-primary-400">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-sm text-primary-600 dark:text-primary-400 
                         hover:text-primary-700 dark:hover:text-primary-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4" />
                    Resend verification code
                  </>
                )}
              </button>
            )}
          </div>

          {/* Alternative Options */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => setShowBackupOption(true)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-300 flex items-center gap-2 mx-auto
                       transition-colors"
            >
              <DevicePhoneMobileIcon className="w-4 h-4" />
              Use backup codes instead
            </button>
          </div>

          {/* Authenticator Apps Help */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                <span className="font-medium">Need help?</span> Make sure your device's time is synchronized. 
                You can use apps like Google Authenticator, Microsoft Authenticator, or Authy.
              </span>
            </p>
          </div>
        </form>
      ) : (
        // Backup Code Form
        <form onSubmit={handleBackupCodeSubmit} className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter one of your backup codes. Each backup code can only be used once.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Backup Code
            </label>
            <input
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              placeholder="XXXXX-XXXXX"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 focus:outline-none 
                       focus:ring-2 focus:ring-primary-500 font-mono text-center"
              disabled={state.isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!backupCode.trim() || state.isLoading}
            className="w-full py-3 px-4 bg-primary-500 text-white font-medium rounded-lg 
                       hover:bg-primary-600 focus:outline-none focus:ring-2 
                       focus:ring-primary-500 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Verifying...' : 'Verify Backup Code'}
          </button>

          <button
            type="button"
            onClick={() => setShowBackupOption(false)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-300 block mx-auto"
          >
            ← Back to authenticator code
          </button>

          {/* Backup Codes Info */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                <span className="font-medium">Important:</span> Backup codes are one-time use. 
                Generate new codes from your security settings after signing in.
              </span>
            </p>
          </div>
        </form>
      )}

      {/* Security Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>2FA Secured</span>
          </div>
          <Link
            href="/admin/help/2fa"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Learn about 2FA
          </Link>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}