'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BellIcon,
  EnvelopeIcon,
  CreditCardIcon,
  GlobeAltIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'

interface SettingsSection {
  id: string
  name: string
  description: string
  icon: any
  settings: Setting[]
}

interface Setting {
  id: string
  name: string
  description: string
  type: 'toggle' | 'select' | 'text' | 'number' | 'textarea'
  value: any
  options?: { value: string; label: string }[]
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'general',
    name: 'General Settings',
    description: 'Basic platform configuration',
    icon: BuildingOfficeIcon,
    settings: [
      {
        id: 'platformName',
        name: 'Platform Name',
        description: 'The name of your platform',
        type: 'text',
        value: 'HopePath',
      },
      {
        id: 'supportEmail',
        name: 'Support Email',
        description: 'Email address for user support',
        type: 'text',
        value: 'support@hopepath.org',
      },
      {
        id: 'timezone',
        name: 'Default Timezone',
        description: 'Default timezone for the platform',
        type: 'select',
        value: 'America/Jamaica',
        options: [
          { value: 'America/Jamaica', label: 'Jamaica (EST)' },
          { value: 'America/New_York', label: 'New York (EST)' },
          { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
          { value: 'Europe/London', label: 'London (GMT)' },
        ],
      },
    ],
  },
  {
    id: 'users',
    name: 'User Settings',
    description: 'User management configuration',
    icon: UserGroupIcon,
    settings: [
      {
        id: 'allowRegistration',
        name: 'Allow Registration',
        description: 'Allow new users to register',
        type: 'toggle',
        value: true,
      },
      {
        id: 'requireEmailVerification',
        name: 'Require Email Verification',
        description: 'Users must verify email before accessing platform',
        type: 'toggle',
        value: true,
      },
      {
        id: 'defaultUserRole',
        name: 'Default User Role',
        description: 'Default role for new users',
        type: 'select',
        value: 'user',
        options: [
          { value: 'user', label: 'User' },
          { value: 'premium', label: 'Premium' },
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Security Settings',
    description: 'Platform security configuration',
    icon: ShieldCheckIcon,
    settings: [
      {
        id: 'passwordMinLength',
        name: 'Minimum Password Length',
        description: 'Minimum characters required for passwords',
        type: 'number',
        value: 8,
      },
      {
        id: 'maxLoginAttempts',
        name: 'Max Login Attempts',
        description: 'Maximum failed attempts before lockout',
        type: 'number',
        value: 5,
      },
      {
        id: 'sessionTimeout',
        name: 'Session Timeout (minutes)',
        description: 'Minutes of inactivity before session expires',
        type: 'number',
        value: 30,
      },
      {
        id: 'requireTwoFactor',
        name: 'Require 2FA for Admins',
        description: 'Admins must use two-factor authentication',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    id: 'notifications',
    name: 'Notification Settings',
    description: 'Email and push notification configuration',
    icon: BellIcon,
    settings: [
      {
        id: 'emailNotifications',
        name: 'Email Notifications',
        description: 'Send email notifications for important events',
        type: 'toggle',
        value: true,
      },
      {
        id: 'pushNotifications',
        name: 'Push Notifications',
        description: 'Send push notifications to users',
        type: 'toggle',
        value: true,
      },
      {
        id: 'notificationEmail',
        name: 'Notification Email',
        description: 'Email address for system notifications',
        type: 'text',
        value: 'notifications@hopepath.org',
      },
    ],
  },
  {
    id: 'email',
    name: 'Email Settings',
    description: 'SMTP and email template configuration',
    icon: EnvelopeIcon,
    settings: [
      {
        id: 'smtpHost',
        name: 'SMTP Host',
        description: 'SMTP server hostname',
        type: 'text',
        value: 'smtp.gmail.com',
      },
      {
        id: 'smtpPort',
        name: 'SMTP Port',
        description: 'SMTP server port',
        type: 'number',
        value: 587,
      },
      {
        id: 'smtpUser',
        name: 'SMTP Username',
        description: 'SMTP authentication username',
        type: 'text',
        value: 'noreply@hopepath.org',
      },
      {
        id: 'smtpPassword',
        name: 'SMTP Password',
        description: 'SMTP authentication password',
        type: 'text',
        value: '********',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payment Settings',
    description: 'Payment gateway configuration',
    icon: CreditCardIcon,
    settings: [
      {
        id: 'paymentGateway',
        name: 'Payment Gateway',
        description: 'Default payment processor',
        type: 'select',
        value: 'stripe',
        options: [
          { value: 'stripe', label: 'Stripe' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'square', label: 'Square' },
        ],
      },
      {
        id: 'currency',
        name: 'Currency',
        description: 'Default currency for payments',
        type: 'select',
        value: 'USD',
        options: [
          { value: 'USD', label: 'US Dollar' },
          { value: 'JMD', label: 'Jamaican Dollar' },
          { value: 'CAD', label: 'Canadian Dollar' },
          { value: 'GBP', label: 'British Pound' },
        ],
      },
      {
        id: 'taxRate',
        name: 'Tax Rate (%)',
        description: 'Default tax rate for transactions',
        type: 'number',
        value: 0,
      },
    ],
  },
  {
    id: 'localization',
    name: 'Localization',
    description: 'Language and regional settings',
    icon: GlobeAltIcon,
    settings: [
      {
        id: 'defaultLanguage',
        name: 'Default Language',
        description: 'Primary language for the platform',
        type: 'select',
        value: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
        ],
      },
      {
        id: 'dateFormat',
        name: 'Date Format',
        description: 'Default date display format',
        type: 'select',
        value: 'MM/DD/YYYY',
        options: [
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
        ],
      },
    ],
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Theme and branding settings',
    icon: PaintBrushIcon,
    settings: [
      {
        id: 'theme',
        name: 'Default Theme',
        description: 'Default color theme for users',
        type: 'select',
        value: 'light',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System Default' },
        ],
      },
      {
        id: 'primaryColor',
        name: 'Primary Color',
        description: 'Main brand color',
        type: 'text',
        value: '#3b82f6',
      },
      {
        id: 'logo',
        name: 'Logo URL',
        description: 'URL for platform logo',
        type: 'text',
        value: '/logo.png',
      },
    ],
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(SETTINGS_SECTIONS)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: section.settings.map(setting =>
            setting.id === settingId ? { ...setting, value } : setting
          ),
        }
      }
      return section
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(SETTINGS_SECTIONS)
    }
  }

  const currentSection = settings.find(s => s.id === activeSection)!

  return (
    <>
      <PageHeader 
        title="Settings"
        subtitle="Configure your platform settings"
      />

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              {settings.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">{currentSection.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {currentSection.description}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {currentSection.settings.map(setting => (
                <div key={setting.id} className="flex items-start justify-between">
                  <div className="flex-1 pr-8">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {setting.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {setting.description}
                    </p>
                  </div>
                  <div className="w-64">
                    {setting.type === 'toggle' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value}
                          onChange={(e) => handleSettingChange(currentSection.id, setting.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(currentSection.id, setting.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      >
                        {setting.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {(setting.type === 'text' || setting.type === 'number') && (
                      <input
                        type={setting.type}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(
                          currentSection.id, 
                          setting.id, 
                          setting.type === 'number' ? Number(e.target.value) : e.target.value
                        )}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    )}

                    {setting.type === 'textarea' && (
                      <textarea
                        value={setting.value}
                        onChange={(e) => handleSettingChange(currentSection.id, setting.id, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50"
              >
                Reset to Default
              </button>
              
              <div className="flex items-center gap-4">
                {saveSuccess && (
                  <span className="text-green-600 dark:text-green-400 text-sm">
                    Settings saved successfully!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}