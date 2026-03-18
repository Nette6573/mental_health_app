'use client'

import { useState } from 'react'
import {
  ShieldCheckIcon,
  KeyIcon,
  ClockIcon,
  FingerPrintIcon,
  GlobeAmericasIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface SecuritySettingsProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function SecuritySettings({ settings, onSettingChange, onNestedChange }: SecuritySettingsProps) {
  const [newIp, setNewIp] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleAddIp = () => {
    if (newIp && !settings.security.ipWhitelist.includes(newIp)) {
      onSettingChange('security', 'ipWhitelist', [...settings.security.ipWhitelist, newIp])
      setNewIp('')
    }
  }

  const handleRemoveIp = (ip: string) => {
    onSettingChange('security', 'ipWhitelist', settings.security.ipWhitelist.filter((i: string) => i !== ip))
  }

  const passwordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[0-9]/.test(password)) score++
    if (/[!@#$%^&*]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    return score
  }

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <KeyIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Password Policy</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure password requirements for user accounts
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="32"
                value={settings.security.passwordMinLength}
                onChange={(e) => onSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Requirements
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordRequireNumbers}
                  onChange={(e) => onSettingChange('security', 'passwordRequireNumbers', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                />
                <span>Require numbers (0-9)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordRequireSymbols}
                  onChange={(e) => onSettingChange('security', 'passwordRequireSymbols', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                />
                <span>Require symbols (!@#$%^&*)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordRequireUppercase}
                  onChange={(e) => onSettingChange('security', 'passwordRequireUppercase', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                />
                <span>Require uppercase letters (A-Z)</span>
              </label>
            </div>
          </div>

          {/* Password Strength Meter */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Password Strength Example</p>
            <div className="flex gap-1 h-2 mb-2">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full ${
                    level <= passwordStrength('Test@123')
                      ? level === 1 ? 'bg-red-500' :
                        level === 2 ? 'bg-yellow-500' :
                        level === 3 ? 'bg-blue-500' : 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Current policy creates {passwordStrength('Test@123') === 4 ? 'strong' : 'moderate'} passwords
            </p>
          </div>
        </div>
      </div>

      {/* Login Security */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Login Security</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure login attempts, sessions, and lockout settings
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => onSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.security.lockoutDuration}
                onChange={(e) => onSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => onSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout Warning (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.security.sessionTimeoutWarning}
                onChange={(e) => onSettingChange('security', 'sessionTimeoutWarning', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.allowMultipleSessions}
                onChange={(e) => onSettingChange('security', 'allowMultipleSessions', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Allow Multiple Sessions</span>
                <p className="text-xs text-gray-500">Users can be logged in from multiple devices simultaneously</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FingerPrintIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure 2FA requirements for different user roles
          </p>
        </div>

        <div className="p-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactorRequired}
              onChange={(e) => onSettingChange('security', 'twoFactorRequired', e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
            />
            <div>
              <span className="font-medium">Require Two-Factor Authentication</span>
              <p className="text-xs text-gray-500">All users must set up 2FA</p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnforced}
              onChange={(e) => onSettingChange('security', 'twoFactorEnforced', e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
            />
            <div>
              <span className="font-medium">Enforce 2FA for Admins</span>
              <p className="text-xs text-gray-500">Admin accounts must use 2FA</p>
            </div>
          </label>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GlobeAmericasIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">IP Whitelist</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Restrict access to specific IP addresses or ranges
          </p>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="Enter IP address or CIDR range (e.g., 192.168.1.0/24)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddIp}
              disabled={!newIp}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {settings.security.ipWhitelist.map((ip: string) => (
              <div
                key={ip}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <code className="text-sm font-mono">{ip}</code>
                <button
                  onClick={() => handleRemoveIp(ip)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}

            {settings.security.ipWhitelist.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No IP addresses whitelisted. All IPs are allowed.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Email/Phone Verification */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">Verification Requirements</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireEmailVerification}
                onChange={(e) => onSettingChange('security', 'requireEmailVerification', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Require Email Verification</span>
                <p className="text-xs text-gray-500">Users must verify their email address</p>
              </div>
            </label>

            {settings.security.requireEmailVerification && (
              <div className="ml-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Link Expiry (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={settings.security.emailVerificationExpiry}
                  onChange={(e) => onSettingChange('security', 'emailVerificationExpiry', parseInt(e.target.value))}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requirePhoneVerification}
                onChange={(e) => onSettingChange('security', 'requirePhoneVerification', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
              />
              <div>
                <span className="font-medium">Require Phone Verification</span>
                <p className="text-xs text-gray-500">Users must verify their phone number via SMS</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* reCAPTCHA */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold">reCAPTCHA</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Protect forms from spam and automated abuse
          </p>
        </div>

        <div className="p-6 space-y-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.recaptchaEnabled}
              onChange={(e) => onSettingChange('security', 'recaptchaEnabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
            />
            <span>Enable reCAPTCHA</span>
          </label>

          {settings.security.recaptchaEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Key
                </label>
                <input
                  type="text"
                  value={settings.security.recaptchaSiteKey || ''}
                  onChange={(e) => onSettingChange('security', 'recaptchaSiteKey', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.security.recaptchaSecretKey || ''}
                    onChange={(e) => onSettingChange('security', 'recaptchaSecretKey', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono pr-10"
                    placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}