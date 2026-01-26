import Rating from '@/components/ui/Rating'
import { useRouter } from 'next/navigation'

export default function TherapistCard({ therapist }) {
  const router = useRouter()

  const handleViewProfile = () => {
    router.push(`/dashboard/therapists/${therapist.id}`)
  }

  const getAvailabilityColor = (availability) => {
    if (availability.includes('Accepting')) return 'text-green-600 dark:text-green-400'
    if (availability.includes('Waitlist')) return 'text-yellow-600 dark:text-yellow-400'
    if (availability.includes('Limited')) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Therapist Image and Basic Info */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {therapist.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
            <div>
              <h3 
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                onClick={handleViewProfile}
              >
                {therapist.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{therapist.title}</p>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
              <Rating value={therapist.rating} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({therapist.reviews})
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {therapist.bio}
          </p>

          {/* Specialties and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {therapist.experience} experience
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {therapist.location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {therapist.online && ' • Online'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {therapist.price}
              </div>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${getAvailabilityColor(therapist.availability)}`}>
                  {therapist.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {therapist.specialty.slice(0, 3).map(spec => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 rounded-full text-xs font-medium capitalize"
                >
                  {spec.replace('-', ' ')}
                </span>
              ))}
              {therapist.specialty.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                  +{therapist.specialty.length - 3}
                </span>
              )}
              {therapist.faithBased && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                  Faith-Based
                </span>
              )}
            </div>
          </div>

          {/* Insurance */}
          {therapist.acceptsInsurance && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Accepts Insurance</h4>
              <div className="flex flex-wrap gap-1">
                {therapist.insurance.slice(0, 2).map(ins => (
                  <span
                    key={ins}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded text-xs"
                  >
                    {ins}
                  </span>
                ))}
                {therapist.insurance.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                    +{therapist.insurance.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex-shrink-0">
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Available</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{therapist.nextAvailable}</p>
            </div>
            
            <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
              <button 
                onClick={handleViewProfile}
                className="flex-1 lg:flex-none bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                View Profile
              </button>
              <button className="flex-1 lg:flex-none border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}