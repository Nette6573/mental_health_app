import { useState, useEffect } from 'react'
import ReviewCard from '@/components/ui/ReviewCard'

export default function ReviewSection({ therapistId }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          patientName: 'Maria G.',
          rating: 5,
          date: '2024-01-15',
          content: 'Dr. Johnson has been incredibly helpful in my journey with anxiety. Her faith-based approach combined with professional expertise has made a significant difference in my life.',
          helpful: 12,
          therapistResponse: {
            content: 'Thank you for your kind words, Maria. It has been a privilege to walk alongside you in your journey. Your progress has been remarkable!',
            date: '2024-01-16'
          }
        },
        {
          id: 2,
          patientName: 'David T.',
          rating: 5,
          date: '2024-01-08',
          content: 'Professional, compassionate, and truly understands the connection between faith and mental health. Highly recommend for anyone seeking Christian counseling.',
          helpful: 8
        },
        {
          id: 3,
          patientName: 'Sarah K.',
          rating: 4,
          date: '2023-12-20',
          content: 'Very knowledgeable and creates a safe space for discussion. The CBT techniques have been practical and effective for managing my depression.',
          helpful: 5
        }
      ]
      
      setReviews(mockReviews)
      setIsLoading(false)
    }

    fetchReviews()
  }, [therapistId])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 h-32"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Patient Reviews
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {reviews.length} reviews from verified patients
            </p>
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 0 && (
        <div className="text-center">
          <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  )
}