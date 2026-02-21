// frontend/src/components/dashboard/settings/PrivacySettings.js
'use client'

import { useState, useEffect } from 'react'

export default function PrivacySettings({ user }) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowMessages: true,
    dataSharing: false,
    personalizedAds: false,
    searchVisibility: true,
    twoFactorAuth: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    // Show welcome message with user's name if available
    if (user?.firstName) {
      setShowWelcomeMessage(true)
      const timer = setTimeout(() => setShowWelcomeMessage(false), 5000)
      return () => clearTimeout(timer)
    }

    // Load user's saved privacy settings from localStorage
    const savedSettings = localStorage.getItem(`privacySettings_${user?.id}`)
    if (savedSettings) {
      setPrivacySettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }, [user])

  const handleSettingChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simulate API call - include user info
    console.log(`Saving privacy settings for user ${user?.id || 'unknown'}:`, {
      userId: user?.id,
      userEmail: user?.email,
      settings: privacySettings
    })
    
    // Save to localStorage with user-specific key
    if (user?.id) {
      localStorage.setItem(`privacySettings_${user.id}`, JSON.stringify(privacySettings))
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSaveSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDownloadData = () => {
    // Prepare user data for download
    const userData = {
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: user?.phone,
        createdAt: user?.createdAt || new Date().toISOString()
      },
      privacySettings: privacySettings,
      exportDate: new Date().toISOString()
    }

    // Create download link
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hopepath-data-${user?.id || 'export'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    console.log(`Deleting account for user ${user?.id}`)
    setShowDeleteConfirmation(false)
    // Redirect to login or show success message
  }

  return (
    <div className="p-8">
      {/* Personalized Welcome Message */}
      {showWelcomeMessage && user?.firstName && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.firstName[0]}
            </div>
            <div>
              <p className="font-medium">Welcome to Privacy Settings, {user.firstName}!</p>
              <p className="text-sm">Control how your data is shared and protected.</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              {saveSuccess === true 
                ? `Privacy settings saved successfully for ${user?.email || 'your account'}!` 
                : 'Your data has been downloaded successfully!'}
            </span>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {user?.firstName ? `${user.firstName}, are` : 'Are'} you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Privacy Settings {user?.firstName && `- ${user.firstName}&apos;s Preferences`}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Control your privacy and data sharing preferences
        </p>
        {user?.email && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            These settings apply to your account: {user.email}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {/* Profile Privacy */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {user?.firstName ? `${user.firstName}&apos;s Profile Privacy` : 'Profile Privacy'}
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Who can see your profile and activity
                </p>
              </div>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="public">Public</option>
                <option value="community">Community Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Show Email Address</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Allow others to see your email address ({user?.email || 'your email'})
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('showEmail', !privacySettings.showEmail)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.showEmail ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.showEmail ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Show Activity Status</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Show when you&apos;re active on the platform
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('showActivity', !privacySettings.showActivity)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.showActivity ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.showActivity ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {user?.firstName ? `${user.firstName}&apos;s Communication` : 'Communication'}
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Allow Direct Messages</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Allow community members to send you direct messages
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('allowMessages', !privacySettings.allowMessages)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.allowMessages ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.allowMessages ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Search Visibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Allow your profile to appear in search results
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('searchVisibility', !privacySettings.searchVisibility)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.searchVisibility ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.searchVisibility ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Security */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {user?.firstName ? `${user.firstName}&apos;s Data & Security` : 'Data & Security'}
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Data Sharing for Research</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Allow anonymous data to be used for mental health research
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('dataSharing', !privacySettings.dataSharing)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.dataSharing ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.dataSharing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('twoFactorAuth', !privacySettings.twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  privacySettings.twoFactorAuth ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    privacySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {user?.firstName ? `${user.firstName}&apos;s Data Management` : 'Data Management'}
          </h3>
          <div className="space-y-4">
            <button
              onClick={handleDownloadData}
              className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Download Your Data</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get a copy of all your data from HopePath
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">Includes data for {user.email}</p>
                )}
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div>
                <h4 className="font-medium text-red-700 dark:text-red-400">Delete Account</h4>
                <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                  Permanently delete your account and all data
                </p>
                {user?.firstName && (
                  <p className="text-xs text-red-500 mt-1">This will remove {user.firstName}&apos;s account permanently</p>
                )}
              </div>
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving {user?.firstName ? `for ${user.firstName}` : '...'}
              </span>
            ) : 'Save Privacy Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}