'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  CloudArrowUpIcon,
  PhotoIcon,
  ClockIcon,
  GlobeAltIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { TIMEZONES, DATE_FORMATS } from '@/constants/settings'

interface GeneralSettingsProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function GeneralSettings({ settings, onSettingChange, onNestedChange }: GeneralSettingsProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.general.logo || null)
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(settings.general.logoDark || null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(settings.general.favicon || null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'logoDark' | 'favicon') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = reader.result as string
        if (type === 'logo') {
          setLogoPreview(preview)
          onSettingChange('general', 'logo', preview)
        } else if (type === 'logoDark') {
          setLogoDarkPreview(preview)
          onSettingChange('general', 'logoDark', preview)
        } else if (type === 'favicon') {
          setFaviconPreview(preview)
          onSettingChange('general', 'favicon', preview)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Branding Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Branding</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your platform's visual identity
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Platform Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform Name *
              </label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) => onSettingChange('general', 'platformName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="HopePath"
              />
              <p className="mt-1 text-xs text-gray-500">
                This name will appear throughout the platform
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={settings.general.platformUrl}
                  onChange={(e) => onSettingChange('general', 'platformUrl', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://hopepath.org"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo (Light Mode)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <CloudArrowUpIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logo')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo (Dark Mode)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-700">
                  {logoDarkPreview ? (
                    <img src={logoDarkPreview} alt="Dark logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <CloudArrowUpIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoDark')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Favicon
              </label>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  {faviconPreview ? (
                    <img src={faviconPreview} alt="Favicon preview" className="w-full h-full object-contain" />
                  ) : (
                    <PhotoIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <CloudArrowUpIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/x-icon,image/png"
                    onChange={(e) => handleLogoUpload(e, 'favicon')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            How users can reach your support team
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={(e) => onSettingChange('general', 'supportEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="support@hopepath.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={settings.general.supportPhone || ''}
                  onChange={(e) => onSettingChange('general', 'supportPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+1-876-555-HELP"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={settings.general.address || ''}
                  onChange={(e) => onSettingChange('general', 'address', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="123 Hope Road, Kingston, Jamaica"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Localization</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Regional settings for dates, times, and timezone
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                Timezone
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => onSettingChange('general', 'timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date Format
              </label>
              <select
                value={settings.general.dateFormat}
                onChange={(e) => onSettingChange('general', 'dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {DATE_FORMATS.map(df => (
                  <option key={df.value} value={df.value}>{df.label}</option>
                ))}
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.general.timeFormat === '12h'}
                    onChange={() => onSettingChange('general', 'timeFormat', '12h')}
                    className="mr-2"
                  />
                  <span>12-hour (3:30 PM)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.general.timeFormat === '24h'}
                    onChange={() => onSettingChange('general', 'timeFormat', '24h')}
                    className="mr-2"
                  />
                  <span>24-hour (15:30)</span>
                </label>
              </div>
            </div>

            {/* Week Starts On */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Week Starts On
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.general.weekStartsOn === 'sunday'}
                    onChange={() => onSettingChange('general', 'weekStartsOn', 'sunday')}
                    className="mr-2"
                  />
                  <span>Sunday</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.general.weekStartsOn === 'monday'}
                    onChange={() => onSettingChange('general', 'weekStartsOn', 'monday')}
                    className="mr-2"
                  />
                  <span>Monday</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-10 w-auto" />
            )}
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {settings.general.platformName}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your platform will display dates like this: {new Date().toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Timezone: {settings.general.timezone}
          </p>
        </div>
      </div>
    </div>
  )
}