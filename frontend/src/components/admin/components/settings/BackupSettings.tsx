'use client'

import { useState } from 'react'
import {
  CloudArrowUpIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  PlayIcon,
  TrashIcon,
  EyeIcon,
  ArchiveBoxIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'
import { BACKUP_FREQUENCIES, BACKUP_STORAGE } from '@/constants/settings'

interface BackupSettingsProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function BackupSettings({ settings, onSettingChange, onNestedChange }: BackupSettingsProps) {
  const [showCreateBackupModal, setShowCreateBackupModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<any>(null)
  const [restoreOptions, setRestoreOptions] = useState({
    restoreDatabase: true,
    restoreFiles: true,
    restoreLogs: false,
  })

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newBackup = {
      id: `backup-${Date.now()}`,
      date: new Date().toISOString(),
      size: Math.floor(Math.random() * 2000000000) + 1000000000, // Random size between 1-3GB
      type: 'full' as const,
      status: 'success' as const,
      location: `${settings.backup.storagePath}/backup-${new Date().toISOString().split('T')[0]}-full.zip`,
    }
    
    onSettingChange('backup', 'backups', [newBackup, ...settings.backup.backups])
    onSettingChange('backup', 'lastBackup', new Date().toISOString())
    
    // Update next backup time
    const nextBackup = new Date()
    if (settings.backup.frequency === 'hourly') {
      nextBackup.setHours(nextBackup.getHours() + 1)
    } else if (settings.backup.frequency === 'daily') {
      nextBackup.setDate(nextBackup.getDate() + 1)
    } else if (settings.backup.frequency === 'weekly') {
      nextBackup.setDate(nextBackup.getDate() + 7)
    } else if (settings.backup.frequency === 'monthly') {
      nextBackup.setMonth(nextBackup.getMonth() + 1)
    }
    onSettingChange('backup', 'nextBackup', nextBackup.toISOString())
    
    setIsCreatingBackup(false)
    setShowCreateBackupModal(false)
  }

  const handleRestoreBackup = async () => {
    // Simulate restore
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`Restore from ${new Date(selectedBackup.date).toLocaleString()} completed!`)
    setShowRestoreModal(false)
    setSelectedBackup(null)
  }

  const handleDeleteBackup = (backupId: string) => {
    const updated = settings.backup.backups.filter((b: any) => b.id !== backupId)
    onSettingChange('backup', 'backups', updated)
    setShowDeleteModal(null)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'in-progress':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CloudArrowUpIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Backup Configuration</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure automated backups and storage settings
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Enable Backups Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium">Automated Backups</h3>
              <p className="text-sm text-gray-500">
                {settings.backup.enabled 
                  ? 'Backups are enabled and running on schedule' 
                  : 'Backups are currently disabled'}
              </p>
            </div>
            <button
              onClick={() => onSettingChange('backup', 'enabled', !settings.backup.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.backup.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.backup.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.backup.enabled && (
            <>
              {/* Backup Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backup.frequency}
                    onChange={(e) => onSettingChange('backup', 'frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {BACKUP_FREQUENCIES.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Time (24h format)
                  </label>
                  <input
                    type="time"
                    value={settings.backup.time}
                    onChange={(e) => onSettingChange('backup', 'time', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Retention Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.backup.retentionDays}
                  onChange={(e) => onSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Backups older than {settings.backup.retentionDays} days will be automatically deleted
                </p>
              </div>

              {/* Storage Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Storage Type
                  </label>
                  <select
                    value={settings.backup.storage}
                    onChange={(e) => onSettingChange('backup', 'storage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {BACKUP_STORAGE.map(storage => (
                      <option key={storage.value} value={storage.value}>{storage.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Storage Path
                  </label>
                  <input
                    type="text"
                    value={settings.backup.storagePath || ''}
                    onChange={(e) => onSettingChange('backup', 'storagePath', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="s3://bucket/path or /local/path"
                  />
                </div>
              </div>

              {/* Backup Contents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Backup Contents
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.includeDatabase}
                      onChange={(e) => onSettingChange('backup', 'includeDatabase', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <div>
                      <span className="font-medium">Include Database</span>
                      <p className="text-xs text-gray-500">Backup all database tables and data</p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.includeFiles}
                      onChange={(e) => onSettingChange('backup', 'includeFiles', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <div>
                      <span className="font-medium">Include Files</span>
                      <p className="text-xs text-gray-500">Backup uploaded files and media</p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.includeLogs}
                      onChange={(e) => onSettingChange('backup', 'includeLogs', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <div>
                      <span className="font-medium">Include Logs</span>
                      <p className="text-xs text-gray-500">Backup system and error logs</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Notifications
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.notifyOnSuccess}
                      onChange={(e) => onSettingChange('backup', 'notifyOnSuccess', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <span>Send notification on successful backup</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.notifyOnFailure}
                      onChange={(e) => onSettingChange('backup', 'notifyOnFailure', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <span>Send notification on backup failure</span>
                  </label>

                  {settings.backup.notificationEmails.length > 0 && (
                    <div className="ml-8">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Notification emails:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {settings.backup.notificationEmails.map((email: string) => (
                          <span
                            key={email}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm flex items-center gap-1"
                          >
                            {email}
                            <button
                              onClick={() => onSettingChange('backup', 'notificationEmails', 
                                settings.backup.notificationEmails.filter((e: string) => e !== email)
                              )}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="email"
                          placeholder="Add email"
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement
                              if (input.value) {
                                onSettingChange('backup', 'notificationEmails', [
                                  ...settings.backup.notificationEmails,
                                  input.value
                                ])
                                input.value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backup Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ServerIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Backup Status</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Last Backup</p>
              <p className="text-lg font-semibold">
                {settings.backup.lastBackup 
                  ? new Date(settings.backup.lastBackup).toLocaleString()
                  : 'Never'
                }
              </p>
              {settings.backup.lastBackup && (
                <p className="text-xs text-gray-400 mt-1">
                  {Math.floor((Date.now() - new Date(settings.backup.lastBackup).getTime()) / 3600000)} hours ago
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Next Backup</p>
              <p className="text-lg font-semibold">
                {settings.backup.nextBackup
                  ? new Date(settings.backup.nextBackup).toLocaleString()
                  : 'Not scheduled'
                }
              </p>
              {settings.backup.nextBackup && (
                <p className="text-xs text-gray-400 mt-1">
                  in {Math.floor((new Date(settings.backup.nextBackup).getTime() - Date.now()) / 3600000)} hours
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Backup Size</p>
              <p className="text-lg font-semibold">
                {formatBytes(settings.backup.backups.reduce((acc: number, b: any) => acc + b.size, 0))}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {settings.backup.backups.length} backup files
              </p>
            </div>
          </div>

          {/* Manual Backup Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowCreateBackupModal(true)}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Create Manual Backup Now
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ArchiveBoxIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Backup History</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Recent backups and their status
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {settings.backup.backups.map((backup: any) => (
              <div
                key={backup.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(backup.status)}
                      <span className="font-medium">
                        {new Date(backup.date).toLocaleString()}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        backup.type === 'full' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {backup.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        backup.status === 'success' 
                          ? 'bg-green-100 text-green-800'
                          : backup.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {backup.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-2 font-medium">{formatBytes(backup.size)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Location:</span>
                        <code className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {backup.location}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBackup(backup)
                        setShowRestoreModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Restore"
                      disabled={backup.status !== 'success'}
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => window.open(backup.location, '_blank')}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Download"
                      disabled={backup.status !== 'success'}
                    >
                      <DocumentArrowDownIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(backup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {settings.backup.backups.length === 0 && (
              <div className="text-center py-8">
                <ArchiveBoxIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No backups available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first backup to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Backup Modal */}
      {showCreateBackupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowCreateBackupModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CloudArrowUpIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Create Manual Backup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  This will create a full backup of your system including database, files, and logs based on your current configuration.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Database:</span>
                      <span className="font-medium">{settings.backup.includeDatabase ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Files:</span>
                      <span className="font-medium">{settings.backup.includeFiles ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Logs:</span>
                      <span className="font-medium">{settings.backup.includeLogs ? '✅' : '❌'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Storage:</span>
                      <span className="font-medium">{settings.backup.storage}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateBackupModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBackup}
                    disabled={isCreatingBackup}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreatingBackup ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Backup'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowRestoreModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Restore from Backup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to restore from backup created on{' '}
                  <span className="font-medium">{new Date(selectedBackup.date).toLocaleString()}</span>?
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                  This will overwrite current data and cannot be undone.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium mb-3">Select components to restore:</p>
                  <div className="space-y-2 text-left">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={restoreOptions.restoreDatabase}
                        onChange={(e) => setRestoreOptions({ ...restoreOptions, restoreDatabase: e.target.checked })}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <span className="font-medium">Restore Database</span>
                        <p className="text-xs text-gray-500">All user data, sessions, and settings</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={restoreOptions.restoreFiles}
                        onChange={(e) => setRestoreOptions({ ...restoreOptions, restoreFiles: e.target.checked })}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <span className="font-medium">Restore Files</span>
                        <p className="text-xs text-gray-500">Uploaded media and documents</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={restoreOptions.restoreLogs}
                        onChange={(e) => setRestoreOptions({ ...restoreOptions, restoreLogs: e.target.checked })}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <span className="font-medium">Restore Logs</span>
                        <p className="text-xs text-gray-500">System and error logs</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestoreBackup}
                    disabled={!restoreOptions.restoreDatabase && !restoreOptions.restoreFiles && !restoreOptions.restoreLogs}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowDeleteModal(null)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Delete Backup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this backup? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(showDeleteModal)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}