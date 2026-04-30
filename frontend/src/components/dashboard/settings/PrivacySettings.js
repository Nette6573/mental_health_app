'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase/firebaseClient'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function PrivacySettings({ user }) {
  const router = useRouter()
  const [dataSharing, setDataSharing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [confirmText, setConfirmText] = useState('')

  const uid = user?.uid ?? user?.id

  // ── Load from Firestore ──
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          const data = snap.data()
          setDataSharing(!!data.dataSharing)
        }
      } catch (err) {
        console.error('Error loading privacy settings:', err)
      }
    }
    load()
  }, [uid])

  const handleSave = async () => {
    if (!uid) return
    setIsSaving(true)
    try {
      await setDoc(doc(db, 'users', uid), { dataSharing }, { merge: true })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      setDeleteError('Please type "delete" to confirm.')
      return
    }
    if (!uid) return

    setDeleteLoading(true)
    setDeleteError('')
    try {
      // Delete Firestore user document
      await deleteDoc(doc(db, 'users', uid))
      // Delete Firebase Auth account
      const currentUser = auth.currentUser
      if (currentUser) await deleteUser(currentUser)
      router.replace('/')
    } catch (err) {
      console.error('Delete error:', err)
      if (err.code === 'auth/requires-recent-login') {
        setDeleteError('For security, please log out, log back in, then try again.')
      } else {
        setDeleteError(err.message || 'Failed to delete account. Please try again.')
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Control your data and account preferences</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✓ Privacy settings saved successfully.
        </div>
      )}

      <div className="space-y-6 max-w-2xl">

        {/* Data Sharing */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy & Data</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Data Sharing for Research</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Allow anonymous data to be used for mental health research to improve HopePath and help the wider community.
              </p>
            </div>
            <button
              onClick={() => setDataSharing(prev => !prev)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                dataSharing ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${dataSharing ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={isSaving}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed">
              {isSaving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>

          {/* Download Data */}
          <button
            onClick={() => {
              const data = { user: { id: uid, email: user?.email, firstName: user?.firstName, lastName: user?.lastName }, exportDate: new Date().toISOString() }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = `hopepath-data-${uid}.json`
              document.body.appendChild(a); a.click()
              document.body.removeChild(a); URL.revokeObjectURL(url)
            }}
            className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-3"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-left">Download Your Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get a copy of all your data from HopePath</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400 text-left">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">Permanently delete your account and all data</p>
            </div>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Account</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete your account, all your data, and cannot be undone. Type <strong>"delete"</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={e => { setConfirmText(e.target.value); setDeleteError('') }}
              placeholder='Type "delete" to confirm'
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white mb-4"
            />
            {deleteError && <p className="text-sm text-red-500 mb-4">{deleteError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirmation(false); setConfirmText(''); setDeleteError('') }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || confirmText.toLowerCase() !== 'delete'}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed">
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
