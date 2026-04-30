'use client'

import { useState, useEffect } from 'react'

export default function DisplaySettings({ user }) {
  const [theme, setTheme] = useState('system')
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved)
    else setTheme('system')
  }, [])

  const applyTheme = (value) => {
    const root = document.documentElement
    if (value === 'dark' || (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const handleThemeChange = (value) => {
    setTheme(value)
    applyTheme(value)
    localStorage.setItem('theme', value)
  }

  const handleSave = async () => {
    setIsLoading(true)
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const THEMES = [
    { value: 'light', label: 'Light', icon: '☀️', description: 'Bright theme for daytime' },
    { value: 'dark', label: 'Dark', icon: '🌙', description: 'Dark theme for nighttime' },
    { value: 'system', label: 'System', icon: '💻', description: 'Follow device setting' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Display Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Customize the appearance of your HopePath experience</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✓ Display settings saved.
        </div>
      )}

      <div className="max-w-xl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Theme Preference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {THEMES.map(t => (
              <button key={t.value} onClick={() => handleThemeChange(t.value)}
                className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                  theme === t.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 ring-opacity-20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{t.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={handleSave} disabled={isLoading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : 'Save Display Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
