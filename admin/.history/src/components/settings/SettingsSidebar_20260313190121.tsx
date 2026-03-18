'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsSidebarProps {
  sections: Array<{
    id: string
    name: string
    icon: string
  }>
  activeSection: string
  onSectionChange: (id: string) => void
  searchQuery: string
}

export default function SettingsSidebar({
  sections,
  activeSection,
  onSectionChange,
  searchQuery,
}: SettingsSidebarProps) {
  const router = useRouter()
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [])

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm sticky top-24">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your platform
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${activeSection === section.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="flex-1 text-left">{section.name}</span>
              {activeSection === section.id && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No settings found for "{searchQuery}"
              </p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>All systems operational</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {lastUpdated ? `Last updated: ${lastUpdated}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}