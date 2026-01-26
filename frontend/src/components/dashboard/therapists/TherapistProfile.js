import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Rating from '@/components/ui/Rating'
import ReviewSection from './ReviewSection'
import BookingModal from '@/components/ui/BookingModal'

export default function TherapistProfile({ therapist }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showBookingModal, setShowBookingModal] = useState(false)

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'approach', name: 'Treatment Approach' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'credentials', name: 'Credentials' }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/dashboard/therapists')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Therapist Profile
        </h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Profile Image and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {therapist.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {therapist.name}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                    {therapist.title}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                  <Rating value={therapist.rating} size="lg" />
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    ({therapist.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialty.map(spec => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium capitalize"
                    >
                      {spec.replace('-', ' ')}
                    </span>
                  ))}
                  {therapist.faithBased && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                      Faith-Based
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Experience</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{therapist.experience}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Languages</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{therapist.languages.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Session Price</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{therapist.price}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Availability</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{therapist.availability}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0">
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Book Session
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                  Send Message
                </button>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Next available: <span className="font-semibold">{therapist.nextAvailable}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <nav className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About Me</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {therapist.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Session Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-900 dark:text-white">{therapist.sessionDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Format:</span>
                      <span className="text-gray-900 dark:text-white">{therapist.sessionDetails.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                      <span className="text-gray-900 dark:text-white">{therapist.sessionDetails.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Initial Assessment:</span>
                      <span className="text-gray-900 dark:text-white">{therapist.sessionDetails.initialAssessment}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Insurance & Payment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Accepts Insurance:</span>
                      <span className={`font-medium ${therapist.acceptsInsurance ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {therapist.acceptsInsurance ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {therapist.acceptsInsurance && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Accepted Providers:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {therapist.insurance.map(provider => (
                            <span
                              key={provider}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                            >
                              {provider}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approach' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Treatment Approach</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {therapist.approach}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Treatment Philosophy</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {therapist.treatmentPhilosophy}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Areas of Specialization</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {therapist.specializations.map((specialization, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{specialization}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewSection therapistId={therapist.id} />
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Education</h3>
                <ul className="space-y-2">
                  {therapist.education.map((edu, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Certifications & Licenses</h3>
                <ul className="space-y-2">
                  {therapist.certifications.map((cert, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        therapist={therapist}
      />
    </div>
  )
}