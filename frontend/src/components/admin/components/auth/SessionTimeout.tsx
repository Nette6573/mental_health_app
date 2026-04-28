'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

const SESSION_CONFIG = {
  WARNING_BEFORE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
}

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const { state, logout, refreshSession } = useAdminAuth()

  useEffect(() => {
    if (!state.sessionExpiry) return

    const checkSession = setInterval(() => {
      const expiryTime = new Date(state.sessionExpiry!).getTime()
      const now = Date.now()
      const timeUntilExpiry = expiryTime - now

      // Show warning 5 minutes before expiry
      if (timeUntilExpiry <= SESSION_CONFIG.WARNING_BEFORE_TIMEOUT && timeUntilExpiry > 0) {
        setShowWarning(true)
        setTimeLeft(Math.floor(timeUntilExpiry / 1000))
      } else {
        setShowWarning(false)
      }

      // Auto logout on expiry
      if (timeUntilExpiry <= 0) {
        handleLogout()
      }
    }, 1000)

    return () => clearInterval(checkSession)
  }, [state.sessionExpiry])

  const handleStayLoggedIn = async () => {
    await refreshSession()
    setShowWarning(false)
  }

  const handleLogout = () => {
    logout()
    setShowWarning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={() => setShowWarning(false)}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg 
              className="w-10 h-10 text-yellow-600 dark:text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Session Expiring Soon
          </h3>
          
          <div className="space-y-3 mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Your session will expire in
            </p>
            
            {/* Timer */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <span className="text-4xl font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatTime(timeLeft)}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                minutes remaining
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Due to inactivity, your session will expire soon.
              <br />
              Click "Stay Logged In" to continue working.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStayLoggedIn}
              className="flex-1 py-3 px-4 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Logout Now
            </button>
          </div>

          {/* Security Note */}
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            For your security, sessions automatically expire after 30 minutes of inactivity.
          </p>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}