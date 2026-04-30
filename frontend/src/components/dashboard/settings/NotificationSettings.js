'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/firebaseClient'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const EMAIL_FIELDS = [
  { key: 'emailGeneral', label: 'General Notifications', description: 'Important updates about your account' },
  { key: 'emailPrayerUpdates', label: 'Prayer Request Updates', description: 'When someone prays for your requests' },
  { key: 'emailCommunityReplies', label: 'Community Replies', description: 'When someone replies to your posts' },
  { key: 'emailDevotionalReminders', label: 'Devotional Reminders', description: 'Daily devotional reminders' },
  { key: 'emailWeeklyDigest', label: 'Weekly Digest', description: 'Summary of your weekly activity' },
  { key: 'emailProductUpdates', label: 'Product Updates', description: 'New features and improvements' },
]

const PUSH_FIELDS = [
  { key: 'pushPrayerRequests', label: 'Prayer Requests', description: 'New prayer requests from community' },
  { key: 'pushCommunityMessages', label: 'Community Messages', description: 'Direct messages and replies' },
  { key: 'pushDevotionalReminders', label: 'Devotional Reminders', description: 'Daily scripture reminders' },
  { key: 'pushEncouragements', label: 'Encouragements', description: 'Words of encouragement from community' },
  { key: 'pushSystemAlerts', label: 'System Alerts', description: 'Important system notifications' },
]

const SMS_FIELDS = [
  { key: 'smsEmergencyPrayer', label: 'Emergency Prayer Requests', description: 'Urgent prayer needs from close connections' },
  { key: 'smsDailyVerse', label: 'Daily Bible Verse', description: 'Receive a daily scripture via SMS' },
  { key: 'smsImportantUpdates', label: 'Important Updates', description: 'Critical system announcements' },
]

const DEFAULT_SETTINGS = {
  emailGeneral: true, emailPrayerUpdates: true, emailCommunityReplies: false,
  emailDevotionalReminders: true, emailWeeklyDigest: true, emailProductUpdates: false,
  pushPrayerRequests: true, pushCommunityMessages: true, pushDevotionalReminders: false,
  pushEncouragements: true, pushSystemAlerts: true,
  smsEmergencyPrayer: true, smsDailyVerse: false, smsImportantUpdates: false,
}

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${on ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function NotificationSettings({ user }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const uid = user?.uid ?? user?.id

  // ── Load from Firestore ──
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          const data = snap.data()
          if (data.notifications) {
            setSettings(prev => ({ ...prev, ...data.notifications }))
          }
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setIsFetching(false)
      }
    }
    load()
  }, [uid])

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const toggleAll = (keys, value) => {
    setSettings(prev => {
      const next = { ...prev }
      keys.forEach(k => { next[k] = value })
      return next
    })
  }

  const handleSave = async () => {
    if (!uid) return
    setIsLoading(true)
    try {
      await setDoc(doc(db, 'users', uid), { notifications: settings }, { merge: true })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const Section = ({ title, subtitle, fields, allKeys }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleAll(allKeys, true)} className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Enable All</button>
          <button onClick={() => toggleAll(allKeys, false)} className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Disable All</button>
        </div>
      </div>
      <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
        {fields.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between pt-4 first:pt-0">
            <div className="flex-1 pr-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
            </div>
            <Toggle on={settings[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  )

  if (isFetching) {
    return <div className="flex items-center justify-center p-16"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage how and when you receive notifications
          {user?.email && <span className="text-gray-500"> — sent to {user.email}</span>}
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✓ Notification settings saved successfully.
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        <Section
          title="Email Notifications"
          subtitle={user?.email ? `Sent to ${user.email}` : undefined}
          fields={EMAIL_FIELDS}
          allKeys={EMAIL_FIELDS.map(f => f.key)}
        />
        <Section
          title="Push Notifications"
          subtitle="Real-time notifications in your browser"
          fields={PUSH_FIELDS}
          allKeys={PUSH_FIELDS.map(f => f.key)}
        />
        <Section
          title="SMS Notifications"
          fields={SMS_FIELDS}
          allKeys={SMS_FIELDS.map(f => f.key)}
        />

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={isLoading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
