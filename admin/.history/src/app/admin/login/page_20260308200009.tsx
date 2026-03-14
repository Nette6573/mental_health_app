'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import AdminLoginForm from '@/components/admin/auth/AdminLoginForm'
import TwoFactorAuth from '@/components/admin/auth/TwoFactorAuth'
import ForgotPassword from '@/components/admin/auth/ForgotPassword'

export default function AdminLoginPage() {
  const router = useRouter()
  const { state } = useAdminAuth()

  useEffect(() => {
    // Redirect if already authenticated
    if (state.isAuthenticated) {
      router.push('/admin')
    }
  }, [state.isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
            <Image
              src="/logo-dark.png"
              alt="HopePath"
              width={48}
              height={48}
              className="dark:hidden"
            />
            <Image
              src="/logo-light.png"
              alt="HopePath"
              width={48}
              height={48}
              className="hidden dark:block"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage HopePath platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button className="flex-1 px-6 py-4 text-sm font-medium text-primary-600 dark:text-primary-400 border-b-2 border-primary-500">
              Admin Login
            </button>
            <Link
              href="/auth/login"
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-center border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              User Login
            </Link>
          </div>

          {/* Form */}
          <div className="p-6">
            {state.requiresTwoFactor ? (
              <TwoFactorAuth />
            ) : (
              <AdminLoginForm />
            )}
          </div>

          {/* Footer Links */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/admin/forgot-password"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Forgot password?
              </Link>
              <Link
                href="/admin/help"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Need help?
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure admin access only. All actions are logged and monitored.
            <br />
            Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}