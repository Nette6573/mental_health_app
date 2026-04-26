'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import AdminLoginForm from '../../components/auth/AdminLoginForm'
import TwoFactorAuth from '../../components/auth/TwoFactorAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const { state } = useAdminAuth()

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/admin')
    }
  }, [state.isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">HP</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage HopePath platform
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 px-6 py-4 text-sm font-medium text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 text-center">
              Admin Login
            </div>
          </div>

          <div className="p-6">
            {state.requiresTwoFactor ? (
              <TwoFactorAuth />
            ) : (
              <AdminLoginForm />
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure admin access only. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}