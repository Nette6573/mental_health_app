'use client'

import { useState } from 'react'

export default function FaithResourceCard({ resource, type, onMarkComplete, onToggleFavorite, onMarkProgress }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeIcon = () => {
    switch (type) {
      case 'devotional':
        return '📖'
      case 'study':
        return '📚'
      case 'prayer':
        return '🙏'
      case 'practice':
        return '💫'
      default:
        return '✨'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      encouragement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      hope: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rest: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'spiritual-growth': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      healing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      fear: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      prayer: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      scripture: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  const getTypeColor = () => {
    switch (type) {
      case 'devotional':
        return 'from-blue-500 to-blue-600'
      case 'study':
        return 'from-purple-500 to-purple-600'
      case 'prayer':
        return 'from-green-500 to-green-600'
      case 'practice':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  const progressPercentage = resource.total ? (resource.completed / resource.total) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${getTypeColor()} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon()}</span>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <button
            onClick={onToggleFavorite}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {resource.favorite ? (
              <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {resource.description}
          </p>
        </div>

        {/* Scripture Reference */}
        {resource.scripture && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {resource.scripture}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {resource.duration}
            </span>
            {resource.level && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {resource.level}
              </span>
            )}
          </div>
          {resource.completed !== undefined && resource.total && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              resource.completed === resource.total 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            }`}>
              {resource.completed}/{resource.total}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {resource.total && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getTypeColor()} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Category Tag */}
        {resource.category && (
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
              {resource.category.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-3">
          {type === 'devotional' && (
            <button
              onClick={onMarkComplete}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm shadow-sm hover:shadow-md"
            >
              {resource.completed ? 'Read Again' : 'Read Now'}
            </button>
          )}
          {type === 'study' && (
            <button
              onClick={() => onMarkProgress(resource.completed + 1)}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm shadow-sm hover:shadow-md"
            >
              {resource.completed === 0 ? 'Start Study' : 
               resource.completed === resource.total ? 'Review' : 'Continue'}
            </button>
          )}
          {type === 'practice' && (
            <button
              onClick={() => onMarkProgress(resource.completed + 1)}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm shadow-sm hover:shadow-md"
            >
              {resource.completed === 0 ? 'Start Practice' : 'Practice Again'}
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-12 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
            {resource.benefits && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Benefits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {resource.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {resource.lastCompleted && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last completed: {resource.lastCompleted}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}