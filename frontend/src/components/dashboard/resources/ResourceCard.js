'use client'

import { useState } from 'react'

const typeIcons = {
  article: { icon: '📄', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
  video: { icon: '🎥', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
  audio: { icon: '🎧', color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
  worksheet: { icon: '📝', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' },
  course: { icon: '🎓', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
  pdf: { icon: '📑', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' }
}

const levelColors = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'All Levels': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

export default function ResourceCard({
  resource,
  isFavorite,
  onFavorite,
  onView,
  featured = false,
  isTracking = false
}) {
  const typeInfo = typeIcons[resource?.type] || typeIcons.article
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

  const handleFavoriteClick = async () => {
    if (isFavoriteLoading || !onFavorite) return
    
    setIsFavoriteLoading(true)
    try {
      await onFavorite()
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const handleViewClick = () => {
    if (onView && typeof onView === 'function') {
      onView()
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(`${resource.title}: ${window.location.href}`)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (!resource) {
    return null
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
        hover:shadow-md transition-all duration-200 overflow-hidden
        ${featured ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''}
        ${isTracking ? 'opacity-75' : ''}
        relative
      `}
    >
      {isTracking && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">Loading...</span>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
          <span className="text-5xl text-white">{typeInfo.icon}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:scale-110 transition-all duration-200 disabled:opacity-50"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavoriteLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : isFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {resource.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
            {resource.type?.charAt(0).toUpperCase() + resource.type?.slice(1) || 'Resource'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {resource.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{resource.rating}</span>
            <span className="text-xs text-gray-500">({resource.reviews})</span>
          </div>
          <span className="text-xs text-gray-500">{resource.duration}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[resource.level]}`}>
            {resource.level}
          </span>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleViewClick}
            disabled={isTracking}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
          >
            {resource.type === 'pdf' ? 'View PDF' : 'View Resource'}
          </button>

          <button
            onClick={handleShare}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}