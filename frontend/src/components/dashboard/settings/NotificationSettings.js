'use client'

import { useState } from 'react'

export default function NotificationSettings({ user }) {
  const [notificationSettings, setNotificationSettings] = useState({
    // Email Notifications
    emailGeneral: true,
    emailPrayerUpdates: true,
    emailCommunityReplies: false,
    emailDevotionalReminders: true,
    emailWeeklyDigest: true,
    emailProductUpdates: false,

    // Push Notifications
    pushPrayerRequests: true,
    pushCommunityMessages: true,
    pushDevotionalReminders: false,
    pushEncouragements: true,
    pushSystemAlerts: true,

    // SMS Notifications
    smsEmergencyPrayer: true,
    smsDailyVerse: false,
    smsImportantUpdates: false,

    // Frequency
    digestFrequency: 'weekly',
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // In a real app, you'd show a success message here
  }

  const toggleAllEmail = (enabled) => {
    setNotificationSettings(prev => ({
      ...prev,
      emailGeneral: enabled,
      emailPrayerUpdates: enabled,
      emailCommunityReplies: enabled,
      emailDevotionalReminders: enabled,
      emailWeeklyDigest: enabled,
      emailProductUpdates: enabled
    }))
  }

  const toggleAllPush = (enabled) => {
    setNotificationSettings(prev => ({
      ...prev,
      pushPrayerRequests: enabled,
      pushCommunityMessages: enabled,
      pushDevotionalReminders: enabled,
      pushEncouragements: enabled,
      pushSystemAlerts: enabled
    }))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage how and when you receive notifications from MindCare
        </p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Receive updates and reminders via email
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllEmail(true)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAllEmail(false)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Disable All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailGeneral', label: 'General Notifications', description: 'Important updates about your account' },
              { key: 'emailPrayerUpdates', label: 'Prayer Request Updates', description: 'When someone prays for your requests' },
              { key: 'emailCommunityReplies', label: 'Community Replies', description: 'When someone replies to your posts' },
              { key: 'emailDevotionalReminders', label: 'Devotional Reminders', description: 'Daily devotional reminders' },
              { key: 'emailWeeklyDigest', label: 'Weekly Digest', description: 'Summary of your weekly activity' },
              { key: 'emailProductUpdates', label: 'Product Updates', description: 'New features and improvements' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(key, !notificationSettings[key])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    notificationSettings[key] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationSettings[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Receive real-time notifications in your browser
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllPush(true)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAllPush(false)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Disable All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'pushPrayerRequests', label: 'Prayer Requests', description: 'New prayer requests from community' },
              { key: 'pushCommunityMessages', label: 'Community Messages', description: 'Direct messages and replies' },
              { key: 'pushDevotionalReminders', label: 'Devotional Reminders', description: 'Daily scripture reminders' },
              { key: 'pushEncouragements', label: 'Encouragements', description: 'Words of encouragement from community' },
              { key: 'pushSystemAlerts', label: 'System Alerts', description: 'Important system notifications' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(key, !notificationSettings[key])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    notificationSettings[key] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationSettings[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SMS Notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'smsEmergencyPrayer', label: 'Emergency Prayer Requests', description: 'Urgent prayer needs from close connections' },
              { key: 'smsDailyVerse', label: 'Daily Bible Verse', description: 'Receive a daily scripture via SMS' },
              { key: 'smsImportantUpdates', label: 'Important Updates', description: 'Critical system announcements' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(key, !notificationSettings[key])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    notificationSettings[key] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationSettings[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency & Quiet Hours */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
          
          <div className="space-y-6">
            {/* Digest Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Weekly Digest Frequency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'never', label: 'Never' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('digestFrequency', option.value)}
                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      notificationSettings.digestFrequency === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Quiet Hours</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Pause notifications during specific hours
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('quietHoursEnabled', !notificationSettings.quietHoursEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  notificationSettings.quietHoursEnabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.quietHoursEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {notificationSettings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHoursStart}
                    onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHoursEnd}
                    onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}