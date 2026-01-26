import Rating from './Rating'

export default function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {review.patientName}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <Rating value={review.rating} size="sm" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(review.date)}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Review Content */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {review.content}
      </p>

      {/* Therapist Response */}
      {review.therapistResponse && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-primary-800 dark:text-primary-300 text-sm">
                  Therapist Response
                </span>
                <span className="text-xs text-primary-600 dark:text-primary-400">
                  {formatDate(review.therapistResponse.date)}
                </span>
              </div>
              <p className="text-primary-700 dark:text-primary-400 text-sm leading-relaxed">
                {review.therapistResponse.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Count */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Helpful ({review.helpful})</span>
        </button>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
          Report
        </button>
      </div>
    </div>
  )
}