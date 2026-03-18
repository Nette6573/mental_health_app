'use client'

import { useState } from 'react'
import {
  GlobeAltIcon,
  KeyIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

interface ApiSettingsProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function ApiSettings({ settings, onSettingChange, onNestedChange }: ApiSettingsProps) {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [newCorsOrigin, setNewCorsOrigin] = useState('')
  const [editingKey, setEditingKey] = useState<any>(null)
  const [editingWebhook, setEditingWebhook] = useState<any>(null)
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [apiKeyForm, setApiKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    expiresAt: '',
  })

  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
  })

  const availablePermissions = [
    'read:users',
    'write:users',
    'delete:users',
    'read:therapists',
    'write:therapists',
    'delete:therapists',
    'read:sessions',
    'write:sessions',
    'delete:sessions',
    'read:resources',
    'write:resources',
    'delete:resources',
    'read:payments',
    'write:payments',
    'read:analytics',
    'manage:webhooks',
    'manage:api_keys',
  ]

  const availableEvents = [
    'user.created',
    'user.updated',
    'user.deleted',
    'therapist.created',
    'therapist.verified',
    'session.created',
    'session.completed',
    'session.cancelled',
    'payment.received',
    'payment.failed',
    'resource.created',
    'resource.updated',
    'resource.deleted',
  ]

  const handleAddCorsOrigin = () => {
    if (newCorsOrigin && !settings.api.corsOrigins.includes(newCorsOrigin)) {
      onSettingChange('api', 'corsOrigins', [...settings.api.corsOrigins, newCorsOrigin])
      setNewCorsOrigin('')
    }
  }

  const handleRemoveCorsOrigin = (origin: string) => {
    onSettingChange('api', 'corsOrigins', settings.api.corsOrigins.filter((o: string) => o !== origin))
  }

  const handleToggleMethod = (method: string) => {
    const current = settings.api.allowedMethods
    const updated = current.includes(method)
      ? current.filter((m: string) => m !== method)
      : [...current, method]
    onSettingChange('api', 'allowedMethods', updated)
  }

  const handleCreateApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: apiKeyForm.name,
      key: `hp_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      permissions: apiKeyForm.permissions,
      createdAt: new Date().toISOString(),
      createdBy: 'admin1',
      status: 'active',
      expiresAt: apiKeyForm.expiresAt || undefined,
    }
    
    onSettingChange('api', 'apiKeys', [...settings.api.apiKeys, newKey])
    setShowApiKeyModal(false)
    setApiKeyForm({ name: '', permissions: [], expiresAt: '' })
  }

  const handleUpdateApiKey = () => {
    const updated = settings.api.apiKeys.map((key: any) =>
      key.id === editingKey.id ? { ...key, ...apiKeyForm } : key
    )
    onSettingChange('api', 'apiKeys', updated)
    setShowApiKeyModal(false)
    setEditingKey(null)
    setApiKeyForm({ name: '', permissions: [], expiresAt: '' })
  }

  const handleRevokeApiKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      const updated = settings.api.apiKeys.map((key: any) =>
        key.id === keyId ? { ...key, status: 'revoked' } : key
      )
      onSettingChange('api', 'apiKeys', updated)
    }
  }

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateWebhook = () => {
    const newWebhook = {
      id: `webhook-${Date.now()}`,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      secret: webhookForm.secret || undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
      failureCount: 0,
    }
    
    onSettingChange('api', 'webhooks', [...settings.api.webhooks, newWebhook])
    setShowWebhookModal(false)
    setWebhookForm({ name: '', url: '', events: [], secret: '' })
  }

  const handleUpdateWebhook = () => {
    const updated = settings.api.webhooks.map((webhook: any) =>
      webhook.id === editingWebhook.id ? { ...webhook, ...webhookForm } : webhook
    )
    onSettingChange('api', 'webhooks', updated)
    setShowWebhookModal(false)
    setEditingWebhook(null)
    setWebhookForm({ name: '', url: '', events: [], secret: '' })
  }

  const handleToggleWebhook = (webhookId: string) => {
    const updated = settings.api.webhooks.map((webhook: any) =>
      webhook.id === webhookId
        ? { ...webhook, status: webhook.status === 'active' ? 'inactive' : 'active' }
        : webhook
    )
    onSettingChange('api', 'webhooks', updated)
  }

  const handleDeleteWebhook = (webhookId: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      const updated = settings.api.webhooks.filter((w: any) => w.id !== webhookId)
      onSettingChange('api', 'webhooks', updated)
    }
  }

  const handleTestWebhook = async (webhook: any) => {
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Test webhook sent to ${webhook.url}`)
  }

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">API Configuration</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure API endpoints and global settings
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* API Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium">API Status</h3>
              <p className="text-sm text-gray-500">
                {settings.api.apiEnabled ? 'API is active and accepting requests' : 'API is disabled'}
              </p>
            </div>
            <button
              onClick={() => onSettingChange('api', 'apiEnabled', !settings.api.apiEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.api.apiEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.api.apiEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* API URL and Version */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API URL
              </label>
              <input
                type="url"
                value={settings.api.apiUrl}
                onChange={(e) => onSettingChange('api', 'apiUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://api.hopepath.org/v1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Version
              </label>
              <input
                type="text"
                value={settings.api.apiVersion}
                onChange={(e) => onSettingChange('api', 'apiVersion', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="v1"
              />
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate Limit (requests per window)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={settings.api.apiRateLimit}
                onChange={(e) => onSettingChange('api', 'apiRateLimit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate Limit Window (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.api.apiRateLimitWindow}
                onChange={(e) => onSettingChange('api', 'apiRateLimitWindow', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* JWT Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JWT Expiry (seconds)
              </label>
              <input
                type="number"
                min="300"
                max="604800"
                value={settings.api.jwtExpiry}
                onChange={(e) => onSettingChange('api', 'jwtExpiry', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {Math.floor(settings.api.jwtExpiry / 3600)} hours
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refresh Token Expiry (seconds)
              </label>
              <input
                type="number"
                min="3600"
                max="2592000"
                value={settings.api.refreshTokenExpiry}
                onChange={(e) => onSettingChange('api', 'refreshTokenExpiry', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {Math.floor(settings.api.refreshTokenExpiry / 86400)} days
              </p>
            </div>
          </div>

          {/* JWT Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JWT Secret
            </label>
            <div className="relative">
              <input
                type={showSecret['jwt'] ? 'text' : 'password'}
                value={settings.api.jwtSecret || ''}
                onChange={(e) => onSettingChange('api', 'jwtSecret', e.target.value)}
                className="w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                placeholder="Enter JWT secret"
              />
              <button
                onClick={() => setShowSecret({ ...showSecret, jwt: !showSecret['jwt'] })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showSecret['jwt'] ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
              ⚠️ Keep this secret! Never share or commit to version control.
            </p>
          </div>
        </div>
      </div>

      {/* CORS Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">CORS Configuration</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Control which domains can access your API
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Allowed Origins */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Allowed Origins
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newCorsOrigin}
                onChange={(e) => setNewCorsOrigin(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleAddCorsOrigin}
                disabled={!newCorsOrigin}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {settings.api.corsOrigins.map((origin: string) => (
                <div key={origin} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <code className="text-sm">{origin}</code>
                  <button
                    onClick={() => handleRemoveCorsOrigin(origin)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allowed Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Allowed HTTP Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].map(method => (
                <button
                  key={method}
                  onClick={() => handleToggleMethod(method)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.api.allowedMethods.includes(method)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold">API Keys</h2>
            </div>
            <button
              onClick={() => {
                setEditingKey(null)
                setApiKeyForm({ name: '', permissions: [], expiresAt: '' })
                setShowApiKeyModal(true)
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Generate New Key
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage API keys for external applications
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {settings.api.apiKeys.map((key: any) => (
              <div
                key={key.id}
                className={`border rounded-lg p-4 ${
                  key.status === 'active' 
                    ? 'border-gray-200 dark:border-gray-700' 
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{key.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {key.status}
                      </span>
                      {key.expiresAt && (
                        <span className="text-xs text-gray-500">
                          Expires: {new Date(key.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded font-mono">
                        {key.key}
                      </code>
                      <button
                        onClick={() => handleCopyKey(key.key, key.id)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Copy key"
                      >
                        {copiedId === key.id ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <DocumentDuplicateIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {key.permissions.map((perm: string) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                      {key.lastUsed && (
                        <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {key.status === 'active' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingKey(key)
                            setApiKeyForm({
                              name: key.name,
                              permissions: key.permissions,
                              expiresAt: key.expiresAt || '',
                            })
                            setShowApiKeyModal(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRevokeApiKey(key.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Revoke"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {settings.api.apiKeys.length === 0 && (
              <div className="text-center py-8">
                <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No API keys generated yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Webhooks Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold">Webhooks</h2>
            </div>
            <button
              onClick={() => {
                setEditingWebhook(null)
                setWebhookForm({ name: '', url: '', events: [], secret: '' })
                setShowWebhookModal(true)
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Webhook
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure webhooks to receive real-time events
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {settings.api.webhooks.map((webhook: any) => (
              <div
                key={webhook.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{webhook.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        webhook.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {webhook.status}
                      </span>
                      {webhook.failureCount > 0 && (
                        <span className="text-xs text-red-500">
                          {webhook.failureCount} failures
                        </span>
                      )}
                    </div>

                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded block mb-3">
                      {webhook.url}
                    </code>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {webhook.events.map((event: string) => (
                        <span
                          key={event}
                          className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded"
                        >
                          {event}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {new Date(webhook.createdAt).toLocaleDateString()}</span>
                      {webhook.lastTriggered && (
                        <span>Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Test Webhook"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleWebhook(webhook.id)}
                      className={`p-2 rounded-lg ${
                        webhook.status === 'active'
                          ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={webhook.status === 'active' ? 'Disable' : 'Enable'}
                    >
                      {webhook.status === 'active' ? (
                        <PauseIcon className="w-5 h-5" />
                      ) : (
                        <PlayIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingWebhook(webhook)
                        setWebhookForm({
                          name: webhook.name,
                          url: webhook.url,
                          events: webhook.events,
                          secret: webhook.secret || '',
                        })
                        setShowWebhookModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {settings.api.webhooks.length === 0 && (
              <div className="text-center py-8">
                <ArrowPathIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No webhooks configured yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {(showApiKeyModal || editingKey) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => {
              setShowApiKeyModal(false)
              setEditingKey(null)
            }} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingKey ? 'Edit API Key' : 'Generate New API Key'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={apiKeyForm.name}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mobile App, Integration Client"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {availablePermissions.map(perm => (
                      <label key={perm} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={apiKeyForm.permissions.includes(perm)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...apiKeyForm.permissions, perm]
                              : apiKeyForm.permissions.filter(p => p !== perm)
                            setApiKeyForm({ ...apiKeyForm, permissions: updated })
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-2"
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiration (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={apiKeyForm.expiresAt}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave empty for no expiration</p>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowApiKeyModal(false)
                      setEditingKey(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingKey ? handleUpdateApiKey : handleCreateApiKey}
                    disabled={!apiKeyForm.name || apiKeyForm.permissions.length === 0}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {editingKey ? 'Update Key' : 'Generate Key'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Modal */}
      {(showWebhookModal || editingWebhook) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => {
              setShowWebhookModal(false)
              setEditingWebhook(null)
            }} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Slack Notifications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Events
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {availableEvents.map(event => (
                      <label key={event} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={webhookForm.events.includes(event)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...webhookForm.events, event]
                              : webhookForm.events.filter(e => e !== event)
                            setWebhookForm({ ...webhookForm, events: updated })
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-2"
                        />
                        {event}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secret (Optional)
                  </label>
                  <input
                    type="text"
                    value={webhookForm.secret}
                    onChange={(e) => setWebhookForm({ ...webhookForm, secret: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Webhook secret for verification"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowWebhookModal(false)
                      setEditingWebhook(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingWebhook ? handleUpdateWebhook : handleCreateWebhook}
                    disabled={!webhookForm.name || !webhookForm.url || webhookForm.events.length === 0}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
                  </button>
                </div>
              </div>
                       </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Modal (continued) */}
      {(showWebhookModal || editingWebhook) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => {
              setShowWebhookModal(false)
              setEditingWebhook(null)
            }} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Slack Notifications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Events
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {availableEvents.map(event => (
                      <label key={event} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={webhookForm.events.includes(event)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...webhookForm.events, event]
                              : webhookForm.events.filter(e => e !== event)
                            setWebhookForm({ ...webhookForm, events: updated })
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-2"
                        />
                        {event}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secret (Optional)
                  </label>
                  <input
                    type="text"
                    value={webhookForm.secret}
                    onChange={(e) => setWebhookForm({ ...webhookForm, secret: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Webhook secret for verification"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Used to verify webhook payloads originate from HopePath
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowWebhookModal(false)
                      setEditingWebhook(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingWebhook ? handleUpdateWebhook : handleCreateWebhook}
                    disabled={!webhookForm.name || !webhookForm.url || webhookForm.events.length === 0}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
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