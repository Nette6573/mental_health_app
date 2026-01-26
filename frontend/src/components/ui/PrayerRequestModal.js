'use client'

import { useState } from 'react'

const prayerCategories = [
  { id: 'anxiety', name: 'Anxiety & Worry' },
  { id: 'depression', name: 'Depression' },
  { id: 'relationships', name: 'Relationships' },
  { id: 'family', name: 'Family' },
  { id: 'financial', name: 'Financial' },
  { id: 'health', name: 'Health & Healing' },
  { id: 'guidance', name: 'Guidance' },
  { id: 'thanksgiving', name: 'Thanksgiving' }
]

export default function PrayerRequestModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    content: '',
    category: 'anxiety',
    isPublic: true,
    isAnonymous: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      content: '',
      category: 'anxiety',
      isPublic: true,
      isAnonymous: false
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Prayer Request
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-6">
              {/* Prayer Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prayer Request *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your prayer request... What would you like the community to pray for?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {prayerCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Share with community prayer wall
                  </span>
                </label>

                {formData.isPublic && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      Post anonymously
                    </span>
                  </label>
                )}
              </div>

              {/* Guidance */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  🙏 Prayer Guidance
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Remember: &quot;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&quot; - Philippians 4:6
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Share Prayer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}