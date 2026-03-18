'use client'

import { useState } from 'react'
import {
  WrenchIcon,
  ClockIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  BugAntIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { LOGGING_LEVELS } from '@/constants/settings'

interface MaintenanceSettingsProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function MaintenanceSettings({ settings, onSettingChange, onNestedChange }: MaintenanceSettingsProps) {
  const [newAllowedIp, setNewAllowedIp] = useState('')
  const [newAllowedRole, setNewAllowedRole] = useState('')
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)

  const handleAddAllowedIp = () => {
    if (newAllowedIp && !settings.maintenance.maintenanceAllowedIps.includes(newAllowedIp)) {
      onSettingChange('maintenance', 'maintenanceAllowedIps', [
        ...settings.maintenance.maintenanceAllowedIps,
        newAllowedIp
      ])
      setNewAllowedIp('')
    }
  }

  const handleRemoveAllowedIp = (ip: string) => {
    onSettingChange('maintenance', 'maintenanceAllowedIps', 
      settings.maintenance.maintenanceAllowedIps.filter((i: string) => i !== ip)
    )
  }

  const handleAddAllowedRole = () => {
    if (newAllowedRole && !settings.maintenance.maintenanceAllowedRoles.includes(newAllowedRole)) {
      onSettingChange('maintenance', 'maintenanceAllowedRoles', [
        ...settings.maintenance.maintenanceAllowedRoles,
        newAllowedRole
      ])
      setNewAllowedRole('')
    }
  }

  const handleRemoveAllowedRole = (role: string) => {
    onSettingChange('maintenance', 'maintenanceAllowedRoles', 
      settings.maintenance.maintenanceAllowedRoles.filter((r: string) => r !== role)
    )
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    // Simulate cache clear
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsClearingCache(false)
    setShowClearCacheConfirm(false)
    alert('Cache cleared successfully!')
  }

  const handleToggleJob = (jobId: string) => {
    const updatedJobs = settings.maintenance.scheduledJobs.map((job: any) =>
      job.id === jobId
        ? { ...job, status: job.status === 'active' ? 'paused' : 'active' }
        : job
    )
    onSettingChange('maintenance', 'scheduledJobs', updatedJobs)
  }

  const handleRunJob = async (jobId: string) => {
    const job = settings.maintenance.scheduledJobs.find((j: any) => j.id === jobId)
    if (job) {
      // Simulate job run
      await new Promise(resolve => setTimeout(resolve, 1000))
      const updatedJobs = settings.maintenance.scheduledJobs.map((j: any) =>
        j.id === jobId
          ? { ...j, lastRun: new Date().toISOString() }
          : j
      )
      onSettingChange('maintenance', 'scheduledJobs', updatedJobs)
      alert(`Job "${job.name}" triggered successfully!`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <WrenchIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Maintenance Mode</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Put the platform in maintenance mode for updates or repairs
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium">Maintenance Mode Status</h3>
              <p className="text-sm text-gray-500">
                {settings.maintenance.maintenanceMode 
                  ? 'Platform is currently in maintenance mode' 
                  : 'Platform is operational'}
              </p>
            </div>
            <button
              onClick={() => onSettingChange('maintenance', 'maintenanceMode', !settings.maintenance.maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenance.maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenance.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.maintenance.maintenanceMode && (
            <>
              {/* Maintenance Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={settings.maintenance.maintenanceMessage}
                  onChange={(e) => onSettingChange('maintenance', 'maintenanceMessage', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="We are currently performing scheduled maintenance. Please check back soon."
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected End Time
                </label>
                <input
                  type="datetime-local"
                  value={settings.maintenance.maintenanceEndTime?.slice(0, 16) || ''}
                  onChange={(e) => onSettingChange('maintenance', 'maintenanceEndTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Allowed IPs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed IP Addresses
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAllowedIp}
                    onChange={(e) => setNewAllowedIp(e.target.value)}
                    placeholder="Enter IP address"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleAddAllowedIp}
                    disabled={!newAllowedIp}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {settings.maintenance.maintenanceAllowedIps.map((ip: string) => (
                    <div key={ip} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <code className="text-sm font-mono">{ip}</code>
                      <button
                        onClick={() => handleRemoveAllowedIp(ip)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allowed Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed User Roles
                </label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={newAllowedRole}
                    onChange={(e) => setNewAllowedRole(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                  <button
                    onClick={handleAddAllowedRole}
                    disabled={!newAllowedRole}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.maintenance.maintenanceAllowedRoles.map((role: string) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {role}
                      <button
                        onClick={() => handleRemoveAllowedRole(role)}
                        className="hover:text-red-500"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ServerIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Cache Management</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure caching behavior and clear cache
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenance.cacheEnabled}
                onChange={(e) => onSettingChange('maintenance', 'cacheEnabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Enable Caching</span>
                <p className="text-xs text-gray-500">Cache static content for better performance</p>
              </div>
            </label>

            {settings.maintenance.cacheEnabled && (
              <>
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cache Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="86400"
                    value={settings.maintenance.cacheDuration}
                    onChange={(e) => onSettingChange('maintenance', 'cacheDuration', parseInt(e.target.value))}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {Math.floor(settings.maintenance.cacheDuration / 60)} minutes
                  </p>
                </div>

                <label className="flex items-center ml-8">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.cacheClearOnUpdate}
                    onChange={(e) => onSettingChange('maintenance', 'cacheClearOnUpdate', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                  />
                  <span className="text-sm">Clear cache on content updates</span>
                </label>
              </>
            )}
          </div>

          {/* Clear Cache Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowClearCacheConfirm(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Clear Cache Now
            </button>
          </div>
        </div>
      </div>

      {/* Logging Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Logging Configuration</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure system logging and error tracking
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logging Level
              </label>
              <select
                value={settings.maintenance.loggingLevel}
                onChange={(e) => onSettingChange('maintenance', 'loggingLevel', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {LOGGING_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Log Retention (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.maintenance.logRetention}
                onChange={(e) => onSettingChange('maintenance', 'logRetention', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Log Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.maintenance.logFormat === 'json'}
                    onChange={() => onSettingChange('maintenance', 'logFormat', 'json')}
                    className="mr-2"
                  />
                  <span>JSON</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.maintenance.logFormat === 'text'}
                    onChange={() => onSettingChange('maintenance', 'logFormat', 'text')}
                    className="mr-2"
                  />
                  <span>Plain Text</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenance.performanceMonitoring}
                onChange={(e) => onSettingChange('maintenance', 'performanceMonitoring', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Enable Performance Monitoring</span>
                <p className="text-xs text-gray-500">Track system performance metrics</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenance.errorTracking}
                onChange={(e) => onSettingChange('maintenance', 'errorTracking', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Enable Error Tracking</span>
                <p className="text-xs text-gray-500">Track and report errors</p>
              </div>
            </label>

            {settings.maintenance.errorTracking && (
              <div className="ml-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sentry DSN
                </label>
                <input
                  type="text"
                  value={settings.maintenance.sentryDsn || ''}
                  onChange={(e) => onSettingChange('maintenance', 'sentryDsn', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://xxx@sentry.io/yyy"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Rate Limiting</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Control request rates to prevent abuse
          </p>
        </div>

        <div className="p-6 space-y-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenance.rateLimiting.enabled}
              onChange={(e) => onNestedChange('maintenance', 'rateLimiting', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
            />
            <span>Enable Rate Limiting</span>
          </label>

          {settings.maintenance.rateLimiting.enabled && (
            <div className="ml-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Requests
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.maintenance.rateLimiting.maxRequests}
                    onChange={(e) => onNestedChange('maintenance', 'rateLimiting', 'maxRequests', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Window (ms)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="3600000"
                    value={settings.maintenance.rateLimiting.windowMs}
                    onChange={(e) => onNestedChange('maintenance', 'rateLimiting', 'windowMs', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Whitelisted IPs
                </label>
                <div className="flex flex-wrap gap-2">
                  {settings.maintenance.rateLimiting.whitelist.map((ip: string) => (
                    <span
                      key={ip}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm flex items-center gap-1"
                    >
                      <code>{ip}</code>
                      <button
                        onClick={() => onNestedChange('maintenance', 'rateLimiting', 'whitelist', 
                          settings.maintenance.rateLimiting.whitelist.filter((i: string) => i !== ip)
                        )}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add IP"
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value) {
                          onNestedChange('maintenance', 'rateLimiting', 'whitelist', [
                            ...settings.maintenance.rateLimiting.whitelist,
                            input.value
                          ])
                          input.value = ''
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Jobs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Scheduled Jobs</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage automated background tasks
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {settings.maintenance.scheduledJobs.map((job: any) => (
              <div
                key={job.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{job.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        Schedule: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{job.schedule}</code>
                      </span>
                      {job.lastRun && (
                        <span className="flex items-center gap-1">
                          <PlayIcon className="w-4 h-4 text-green-500" />
                          Last: {new Date(job.lastRun).toLocaleString()}
                        </span>
                      )}
                      {job.nextRun && (
                        <span className="flex items