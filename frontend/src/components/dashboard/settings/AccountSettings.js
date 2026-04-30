'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase/firebaseClient'
import { sendPasswordResetEmail } from 'firebase/auth'
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export default function AccountSettings({ user }) {
  const [activeTab, setActiveTab] = useState('password')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')
  const [loginHistory, setLoginHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const uid = user?.uid ?? user?.id
  const email = user?.email || auth.currentUser?.email

  // ── Load login history from Firestore ──
  useEffect(() => {
    if (activeTab !== 'sessions' || !uid) return
    const fetchHistory = async () => {
      setLoadingHistory(true)
      try {
        const q = query(
          collection(db, 'users', uid, 'login_history'),
          orderBy('timestamp', 'desc'),
          limit(10)
        )
        const snap = await getDocs(q)
        setLoginHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('Error fetching login history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [activeTab, uid])

  const handleResetPassword = async () => {
    if (!email) return
    setResetLoading(true)
    setResetError('')
    setResetSent(false)
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
    } catch (err) {
      setResetError('Failed to send reset email. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const tabs = [
    { id: 'password', name: 'Reset Password', icon: '🔒' },
    { id: 'sessions', name: 'Login Sessions', icon: '💻' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Security</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account security and login activity</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span><span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Reset Password Tab */}
      {activeTab === 'password' && (
        <div className="max-w-md space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Reset your password</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We'll send a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
            </p>
          </div>

          {resetSent && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              ✓ Password reset email sent to <strong>{email}</strong>. Check your inbox.
            </div>
          )}

          {resetError && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
              {resetError}
            </div>
          )}

          <button
            onClick={handleResetPassword}
            disabled={resetLoading || resetSent}
            className="w-full md:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {resetLoading ? 'Sending...' : resetSent ? 'Email Sent ✓' : 'Send Reset Link'}
          </button>
        </div>
      )}

      {/* Login Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Your recent login activity. If you see any unrecognized sessions, reset your password immediately.
            </p>
          </div>

          {loadingHistory ? (
            <div className="py-8 text-center text-gray-400">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto" />
              <p className="mt-2 text-sm">Loading login history...</p>
            </div>
          ) : loginHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="font-medium">No login history yet</p>
              <p className="text-sm mt-1">Login events will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory.map((session, i) => (
                <div key={session.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {session.device || 'Unknown Device'}
                      </span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">
                          Most Recent
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                      <div>{formatDate(session.timestamp)}</div>
                      {session.location && <div>📍 {session.location}</div>}
                      {session.browser && <div>🌐 {session.browser}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
