import Rating from '@/components/ui/Rating'

const typeIcons = {
  article: { icon: '📄', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
  video: { icon: '🎥', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
  audio: { icon: '🎧', color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
  worksheet: { icon: '📝', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' },
  course: { icon: '🎓', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' }
}

const levelColors = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'All Levels': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

export default function ResourceCard({ resource, isFavorite, onFavorite, featured = false }) {
  const typeInfo = typeIcons[resource.type] || typeIcons.article

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
      hover:shadow-md transition-all duration-200 overflow-hidden
      ${featured ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''}
    `}>
      {/* Image/Header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
          <span className="text-4xl text-white">{typeInfo.icon}</span>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={onFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:scale-110 transition-all duration-200"
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Featured Badge */}
        {resource.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {resource.title}
          </h3>
          <div className="flex items-center justify-between">
            <Rating value={resource.rating} size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {resource.reviews} reviews
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {resource.duration}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[resource.level]}`}>
              {resource.level}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
            View Resource
          </button>
          <button className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}