'use client'

import { useState, useEffect } from 'react'

export default function DisplaySettings({ user }) {
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    language: 'en',
    density: 'comfortable',
    prayerDisplay: 'cards',
    scriptureVersion: 'NIV'
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('displaySettings')
    if (savedSettings) {
      setDisplaySettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }, [])

  const handleSettingChange = (key, value) => {
    const newSettings = { ...displaySettings, [key]: value }
    setDisplaySettings(newSettings)
    localStorage.setItem('displaySettings', JSON.stringify(newSettings))
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value)
    }
  }

  const applyTheme = (theme) => {
    const root = document.documentElement
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const resetToDefaults = () => {
    const defaults = {
      theme: 'system',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,
      language: 'en',
      density: 'comfortable',
      prayerDisplay: 'cards',
      scriptureVersion: 'NIV'
    }
    setDisplaySettings(defaults)
    localStorage.setItem('displaySettings', JSON.stringify(defaults))
    applyTheme('system')
  }

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: '14px' },
    { value: 'medium', label: 'Medium', size: '16px' },
    { value: 'large', label: 'Large', size: '18px' },
    { value: 'xlarge', label: 'Extra Large', size: '20px' }
  ]

  const bibleVersions = [
    { value: 'NIV', label: 'New International Version (NIV)' },
    { value: 'ESV', label: 'English Standard Version (ESV)' },
    { value: 'KJV', label: 'King James Version (KJV)' },
    { value: 'NKJV', label: 'New King James Version (NKJV)' },
    { value: 'NASB', label: 'New American Standard Bible (NASB)' },
    { value: 'NLT', label: 'New Living Translation (NLT)' }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Display Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize the appearance and behavior of MindCare
        </p>
      </div>

      <div className="space-y-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Theme & Appearance</h3>
          
          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Theme Preference
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: '☀️', description: 'Bright theme for daytime' },
                  { value: 'dark', label: 'Dark', icon: '🌙', description: 'Dark theme for nighttime' },
                  { value: 'system', label: 'System', icon: '💻', description: 'Follow device setting' }
                ].map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', theme.value)}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      displaySettings.theme === theme.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 ring-opacity-20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{theme.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Font Size
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fontSizeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('fontSize', option.value)}
                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      displaySettings.fontSize === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    style={{ fontSize: option.size }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Density */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Layout Density
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'compact', label: 'Compact' },
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'spacious', label: 'Spacious' }
                ].map(density => (
                  <button
                    key={density.value}
                    onClick={() => handleSettingChange('density', density.value)}
                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      displaySettings.density === density.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {density.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Accessibility</h3>
          
          <div className="space-y-6">
            {[
              {
                key: 'reducedMotion',
                label: 'Reduced Motion',
                description: 'Reduce animations and transitions for better accessibility'
              },
              {
                key: 'highContrast',
                label: 'High Contrast Mode',
                description: 'Increase color contrast for better readability'
              }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(key, !displaySettings[key])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    displaySettings[key] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      displaySettings[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content Preferences */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content Preferences</h3>
          
          <div className="space-y-6">
            {/* Bible Version */}
            <div>
              <label htmlFor="scriptureVersion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Bible Version
              </label>
              <select
                id="scriptureVersion"
                value={displaySettings.scriptureVersion}
                onChange={(e) => handleSettingChange('scriptureVersion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {bibleVersions.map(version => (
                  <option key={version.value} value={version.value}>
                    {version.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prayer Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Prayer Request Display
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'cards', label: 'Cards', description: 'Visual card layout' },
                  { value: 'list', label: 'List', description: 'Compact list view' }
                ].map(display => (
                  <button
                    key={display.value}
                    onClick={() => handleSettingChange('prayerDisplay', display.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      displaySettings.prayerDisplay === display.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{display.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{display.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                id="language"
                value={displaySettings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Preview</h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  U
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Sample Prayer Request</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This is how content will appear with your current settings</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              Changes are applied instantly. Your preferences are saved automatically.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={resetToDefaults}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            {isLoading ? 'Saving...' : 'Save Display Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}