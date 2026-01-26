'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistCard from '@/components/dashboard/therapists/TherapistCard'
import SpecialtyFilters from '@/components/dashboard/therapists/SpecialtyFilters'
import SearchBar from '@/components/dashboard/resources/SearchBar'

const specialties = [
  { id: 'all', name: 'All Specialties', count: 45 },
  { id: 'anxiety', name: 'Anxiety', count: 18 },
  { id: 'depression', name: 'Depression', count: 15 },
  { id: 'trauma', name: 'Trauma & PTSD', count: 12 },
  { id: 'relationships', name: 'Relationships', count: 14 },
  { id: 'faith', name: 'Faith-Based', count: 8 },
  { id: 'cbt', name: 'Cognitive Behavioral', count: 16 },
  { id: 'family', name: 'Family Therapy', count: 9 },
  { id: 'addiction', name: 'Addiction', count: 7 },
  { id: 'lgbtq', name: 'LGBTQ+ Affirming', count: 11 }
]

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'kingston', name: 'Kingston', count: 22 },
  { id: 'montego-bay', name: 'Montego Bay', count: 12 },
  { id: 'ocho-rios', name: 'Ocho Rios', count: 6 },
  { id: 'portmore', name: 'Portmore', count: 8 },
  { id: 'spanish-town', name: 'Spanish Town', count: 4 },
  { id: 'online', name: 'Online Only', count: 15 }
]

const filters = [
  { id: 'faith-based', name: 'Faith-Based', icon: '🙏' },
  { id: 'online-now', name: 'Online Now', icon: '💚' },
  { id: 'accepting-new', name: 'Accepting New Patients', icon: '✅' },
  { id: 'insurance', name: 'Accepts Insurance', icon: '🏥' },
  { id: 'evening', name: 'Evening Appointments', icon: '🌙' },
  { id: 'weekend', name: 'Weekend Availability', icon: '📅' }
]

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [therapists, setTherapists] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Extended mock therapists data
      const mockTherapists = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          title: 'Clinical Psychologist',
          specialty: ['anxiety', 'depression', 'cbt', 'faith'],
          location: 'kingston',
          online: true,
          available: true,
          image: '/images/therapists/dr-johnson.jpg',
          rating: 4.9,
          reviews: 156,
          experience: '12 years',
          languages: ['English', 'Spanish'],
          bio: 'Specialized in cognitive behavioral therapy with a focus on anxiety disorders and depression. Integrates faith-based approaches when requested.',
          availability: 'Accepting new patients',
          faithBased: true,
          price: '$120/session',
          insurance: ['Blue Cross', 'Aetna', 'Sagicor'],
          education: 'PhD in Clinical Psychology, University of the West Indies',
          approach: 'Cognitive Behavioral Therapy, Faith-Based Integration, Mindfulness',
          acceptsInsurance: true,
          eveningHours: true,
          weekendHours: false,
          nextAvailable: 'Tomorrow at 2:00 PM'
        },
        {
          id: 2,
          name: 'Michael Brown',
          title: 'Licensed Clinical Social Worker',
          specialty: ['trauma', 'relationships', 'family'],
          location: 'montego-bay',
          online: true,
          available: true,
          image: '/images/therapists/michael-brown.jpg',
          rating: 4.8,
          reviews: 89,
          experience: '8 years',
          languages: ['English'],
          bio: 'Trauma-informed therapist specializing in family systems and relationship counseling. EMDR certified.',
          availability: 'Waitlist available',
          faithBased: false,
          price: '$95/session',
          insurance: ['Cigna', 'United Healthcare'],
          education: 'MSW, University of Technology, Jamaica',
          approach: 'Family Systems, EMDR, Trauma-Informed Care',
          acceptsInsurance: true,
          eveningHours: false,
          weekendHours: true,
          nextAvailable: 'Next week'
        },
        {
          id: 3,
          name: 'Dr. Lisa Williams',
          title: 'Psychiatrist',
          specialty: ['depression', 'anxiety', 'faith', 'addiction'],
          location: 'online',
          online: true,
          available: true,
          image: '/images/therapists/dr-williams.jpg',
          rating: 4.9,
          reviews: 203,
          experience: '15 years',
          languages: ['English', 'French'],
          bio: 'Board-certified psychiatrist integrating faith-based approaches with evidence-based treatments. Specializes in medication management and therapy.',
          availability: 'Accepting new patients',
          faithBased: true,
          price: '$150/session',
          insurance: ['Blue Cross', 'Aetna', 'Cigna', 'Medihelp'],
          education: 'MD, Psychiatry, University of the West Indies',
          approach: 'Medication Management, Faith-Based Therapy, CBT',
          acceptsInsurance: true,
          eveningHours: true,
          weekendHours: true,
          nextAvailable: 'Today at 4:00 PM'
        },
        {
          id: 4,
          name: 'Robert Davis',
          title: 'Marriage and Family Therapist',
          specialty: ['relationships', 'family', 'faith'],
          location: 'ocho-rios',
          online: false,
          available: true,
          image: '/images/therapists/robert-davis.jpg',
          rating: 4.7,
          reviews: 67,
          experience: '10 years',
          languages: ['English'],
          bio: 'Specializing in couples counseling and family therapy with a Christian perspective. Gottman Method Level 2 certified.',
          availability: 'Limited availability',
          faithBased: true,
          price: '$85/session',
          insurance: [],
          education: 'MA in Marriage and Family Therapy, Northern Caribbean University',
          approach: 'Gottman Method, Christian Counseling, Family Systems',
          acceptsInsurance: false,
          eveningHours: true,
          weekendHours: false,
          nextAvailable: 'In 3 days'
        },
        {
          id: 5,
          name: 'Dr. Amanda Chen',
          title: 'Clinical Psychologist',
          specialty: ['anxiety', 'trauma', 'lgbtq'],
          location: 'portmore',
          online: true,
          available: false,
          image: '/images/therapists/dr-chen.jpg',
          rating: 4.8,
          reviews: 134,
          experience: '9 years',
          languages: ['English', 'Mandarin'],
          bio: 'Specializes in trauma recovery and anxiety disorders with a focus on LGBTQ+ affirming care. EMDR and DBT trained.',
          availability: 'Not accepting new patients',
          faithBased: false,
          price: '$110/session',
          insurance: ['Aetna', 'Sagicor'],
          education: 'PhD in Clinical Psychology, University of the West Indies',
          approach: 'EMDR, DBT, LGBTQ+ Affirming Therapy',
          acceptsInsurance: true,
          eveningHours: false,
          weekendHours: true,
          nextAvailable: 'Waitlist only'
        },
        {
          id: 6,
          name: 'Patricia Thompson',
          title: 'Licensed Professional Counselor',
          specialty: ['depression', 'addiction', 'faith'],
          location: 'spanish-town',
          online: true,
          available: true,
          image: '/images/therapists/patricia-thompson.jpg',
          rating: 4.6,
          reviews: 92,
          experience: '7 years',
          languages: ['English', 'Patois'],
          bio: 'Specializes in addiction recovery and depression treatment with integrated spiritual support. Certified addiction counselor.',
          availability: 'Accepting new patients',
          faithBased: true,
          price: '$75/session',
          insurance: ['Blue Cross'],
          education: 'MA in Counseling, International University of the Caribbean',
          approach: 'Addiction Counseling, Faith-Based Support, Motivational Interviewing',
          acceptsInsurance: true,
          eveningHours: true,
          weekendHours: true,
          nextAvailable: 'Tomorrow at 10:00 AM'
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
        therapist.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specialty.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
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

    // Active filters
    if (activeFilters.size > 0) {
      filtered = filtered.filter(therapist => {
        for (const filter of activeFilters) {
          switch (filter) {
            case 'faith-based':
              if (!therapist.faithBased) return false
              break
            case 'online-now':
              if (!therapist.online || !therapist.available) return false
              break
            case 'accepting-new':
              if (!therapist.availability.includes('Accepting')) return false
              break
            case 'insurance':
              if (!therapist.acceptsInsurance) return false
              break
            case 'evening':
              if (!therapist.eveningHours) return false
              break
            case 'weekend':
              if (!therapist.weekendHours) return false
              break
          }
        }
        return true
      })
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'price-low':
          return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''))
        case 'price-high':
          return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''))
        case 'availability':
          return a.availability.includes('Accepting') ? -1 : 1
        default:
          return 0
      }
    })

    setFilteredTherapists(filtered)
  }, [searchQuery, selectedSpecialty, selectedLocation, activeFilters, sortBy, therapists])

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev)
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId)
      } else {
        newFilters.add(filterId)
      }
      return newFilters
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading therapists...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Your Therapist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect with licensed mental health professionals in Jamaica
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                <span className="font-semibold">Need immediate help?</span> Call our crisis line
              </p>
              <a 
                href="tel:+18765554321" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
              >
                +1 (876) 555-HELP
              </a>
            </div>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search therapists by name, specialty, or approach..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="rating">Sort by: Highest Rated</option>
                <option value="experience">Sort by: Most Experienced</option>
                <option value="price-low">Sort by: Price Low to High</option>
                <option value="price-high">Sort by: Price High to Low</option>
                <option value="availability">Sort by: Availability</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`
                    inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                    ${activeFilters.has(filter.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                    }
                  `}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
              <SpecialtyFilters
                specialties={specialties}
                locations={locations}
                selectedSpecialty={selectedSpecialty}
                selectedLocation={selectedLocation}
                onSpecialtyChange={setSelectedSpecialty}
                onLocationChange={setSelectedLocation}
              />
            </div>
          </div>

          {/* Therapists List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Available Therapists
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredTherapists.length} therapists found
                  {selectedSpecialty !== 'all' && ` in ${specialties.find(s => s.id === selectedSpecialty)?.name}`}
                  {selectedLocation !== 'all' && ` near ${locations.find(l => l.id === selectedLocation)?.name}`}
                </p>
              </div>
            </div>

            {/* Therapists Grid */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
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
            ) : filteredTherapists.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No therapists found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  We couldn&apos;t find any therapists matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSpecialty('all')
                    setSelectedLocation('all')
                    setActiveFilters(new Set())
                  }}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTherapists.map(therapist => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredTherapists.length > 0 && (
              <div className="mt-8 text-center">
                <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                  Load More Therapists
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}