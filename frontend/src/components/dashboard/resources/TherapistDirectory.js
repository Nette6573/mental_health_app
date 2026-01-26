'use client'

import { useState, useEffect } from 'react'
import TherapistCard from './TherapistCard'
import SearchBar from './SearchBar'
import ResourceFilter from './ResourceFilter'

const specialties = [
  { id: 'all', name: 'All Specialties' },
  { id: 'anxiety', name: 'Anxiety' },
  { id: 'depression', name: 'Depression' },
  { id: 'trauma', name: 'Trauma & PTSD' },
  { id: 'relationships', name: 'Relationships' },
  { id: 'faith', name: 'Faith-Based' },
  { id: 'cbt', name: 'Cognitive Behavioral' },
  { id: 'family', name: 'Family Therapy' }
]

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'kingston', name: 'Kingston' },
  { id: 'montego-bay', name: 'Montego Bay' },
  { id: 'ocho-rios', name: 'Ocho Rios' },
  { id: 'portmore', name: 'Portmore' },
  { id: 'online', name: 'Online Only' }
]

export default function TherapistDirectory() {
  const [therapists, setTherapists] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Mock therapists data
      const mockTherapists = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          title: 'Clinical Psychologist',
          specialty: ['anxiety', 'depression', 'cbt'],
          location: 'kingston',
          online: true,
          image: '/images/therapists/dr-johnson.jpg',
          rating: 4.9,
          reviews: 156,
          experience: '12 years',
          languages: ['English', 'Spanish'],
          bio: 'Specialized in cognitive behavioral therapy with a focus on anxiety disorders and depression.',
          availability: 'Accepting new patients',
          faithBased: true,
          price: '$120/session',
          insurance: ['Blue Cross', 'Aetna']
        },
        {
          id: 2,
          name: 'Michael Brown',
          title: 'Licensed Clinical Social Worker',
          specialty: ['trauma', 'relationships', 'family'],
          location: 'montego-bay',
          online: true,
          image: '/images/therapists/michael-brown.jpg',
          rating: 4.8,
          reviews: 89,
          experience: '8 years',
          languages: ['English'],
          bio: 'Trauma-informed therapist specializing in family systems and relationship counseling.',
          availability: 'Waitlist available',
          faithBased: false,
          price: '$95/session',
          insurance: ['Cigna', 'United Healthcare']
        },
        {
          id: 3,
          name: 'Dr. Lisa Williams',
          title: 'Psychiatrist',
          specialty: ['depression', 'anxiety', 'faith'],
          location: 'online',
          online: true,
          image: '/images/therapists/dr-williams.jpg',
          rating: 4.9,
          reviews: 203,
          experience: '15 years',
          languages: ['English', 'French'],
          bio: 'Board-certified psychiatrist integrating faith-based approaches with evidence-based treatments.',
          availability: 'Accepting new patients',
          faithBased: true,
          price: '$150/session',
          insurance: ['Blue Cross', 'Aetna', 'Cigna']
        },
        {
          id: 4,
          name: 'Robert Davis',
          title: 'Marriage and Family Therapist',
          specialty: ['relationships', 'family', 'faith'],
          location: 'ocho-rios',
          online: false,
          image: '/images/therapists/robert-davis.jpg',
          rating: 4.7,
          reviews: 67,
          experience: '10 years',
          languages: ['English'],
          bio: 'Specializing in couples counseling and family therapy with a Christian perspective.',
          availability: 'Limited availability',
          faithBased: true,
          price: '$85/session',
          insurance: []
        }
      ]
      
      setTherapists(mockTherapists)
      setFilteredTherapists(mockTherapists)
      setIsLoading(false)
    }

    fetchTherapists()
  }, [])

  // Filter therapists
  useEffect(() => {
    let filtered = therapists

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(therapist =>
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(therapist => therapist.specialty.includes(selectedSpecialty))
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(therapist => therapist.location === selectedLocation)
    }

    setFilteredTherapists(filtered)
  }, [searchQuery, selectedSpecialty, selectedLocation, therapists])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-48 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search therapists by name, specialty, or location..."
            />
          </div>
          <div className="flex space-x-4">
            <ResourceFilter
              label="Specialty"
              options={specialties}
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
            />
            <ResourceFilter
              label="Location"
              options={locations}
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        </div>
      </div>

      {/* Therapists Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Available Therapists
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTherapists.length} therapists found
        </span>
      </div>

      {/* Therapists List */}
      <div className="space-y-4">
        {filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No therapists found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new therapists.
            </p>
          </div>
        ) : (
          filteredTherapists.map(therapist => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))
        )}
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 dark:text-red-400 text-lg">🚨</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Need Immediate Help?
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-3">
              If you&apos;re experiencing a mental health crisis, don&apos;t wait for an appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+18765554321"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Call Crisis Line: +1 (876) 555-HELP
              </a>
              <a
                href="/crisis-resources"
                className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Emergency Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}