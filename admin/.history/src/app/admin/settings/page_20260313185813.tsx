'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import SettingsSidebar from '@/components/settings/SettingsSidebar'
import GeneralSettings from '@/components/settings/GeneralSettings'
import SecuritySettings from '@/components/settings/SecuritySettings'
import EmailSettings from '@/components/settings/EmailSettings'
import NotificationSettings from '@/components/settings/NotificationSettings'
import UserSettings from '@/components/settings/UserSettings'
import PaymentSettings from '@/components/settings/PaymentSettings'
import IntegrationSettings from '@/components/settings/IntegrationSettings'
import BackupSettings from '@/components/settings/BackupSettings'
import MaintenanceSettings from '@/components/settings/MaintenanceSettings'
import ApiSettings from '@/components/settings/ApiSetting'
import SettingsAuditLog from '@/components/settings/SettingsAuditLog'
import { MOCK_SETTINGS, MOCK_AUDIT_LOGS } from '@/constants/settings'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(MOCK_SETTINGS)
  const [auditLogs] = useState(MOCK_AUDIT_LOGS)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleNestedSettingChange = (section: string, parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parent]: {
          ...(prev[section as keyof typeof prev] as any)[parent],
          [key]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In production, this would be an API call to save settings
      console.log('Saving settings:', settings)
      
      setSaveSuccess(true)
      setHasChanges(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSettings(MOCK_SETTINGS)
      setHasChanges(true)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `settings-backup-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setSettings(imported)
        setHasChanges(true)
      } catch (error) {
        alert('Invalid settings file')
      }
    }
    reader.readAsText(file)
  }

  const sections = [
    { id: 'general', name: 'General', icon: '🏠', component: GeneralSettings },
    { id: 'security', name: 'Security', icon: '🔒', component: SecuritySettings },
    { id: 'email', name: 'Email', icon: '📧', component: EmailSettings },
    { id: 'notifications', name: 'Notifications', icon: '🔔', component: NotificationSettings },
    { id: 'users', name: 'Users', icon: '👥', component: UserSettings },
    { id: 'payments', name: 'Payments', icon: '💰', component: PaymentSettings },
    { id: 'integrations', name: 'Integrations', icon: '🔌', component: IntegrationSettings },
    { id: 'backup', name: 'Backup', icon: '💾', component: BackupSettings },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', component: MaintenanceSettings },
    { id: 'api', name: 'API', icon: '🌐', component: ApiSettings },
    { id: 'audit', name: 'Audit Log', icon: '📋', component: SettingsAuditLog },
  ]

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || GeneralSettings

  return (
    <>
      <PageHeader 
        title="System Settings"
        subtitle="Configure and manage all platform settings"
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Export/Import */}
          <div className="relative">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Export
            </button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className="ml-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Import
            </label>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset to Default
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-2 bg-primary-500 text-white rounded-lg transition-colors flex items-center gap-2 ${
              hasChanges && !isSaving
                ? 'hover:bg-primary-600'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </PageHeader>

      {/* Status Messages */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-800 dark:text-green-400">Settings saved successfully!</p>
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 dark:text-red-400">{saveError}</p>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-800 dark:text-yellow-400">You have unsaved changes. Don't forget to save!</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <SettingsSidebar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          searchQuery={searchQuery}
        />

        {/* Settings Content */}
        <div className="flex-1">
          <ActiveComponent
            settings={settings}
            onSettingChange={handleSettingChange}
            onNestedChange={handleNestedSettingChange}
          />
        </div>
      </div>
    </>
  )
}