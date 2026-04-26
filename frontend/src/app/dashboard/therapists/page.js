'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistCard from '@/components/dashboard/therapists/TherapistCard'
import SpecialtyFilters from '@/components/dashboard/therapists/SpecialtyFilters'
import SearchBar from '@/components/dashboard/resources/SearchBar'

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

  // ===============================
  // FETCH PROVIDERS FROM FIREBASE
  // ===============================
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true)

        // Pull all documents from the Firebase "providers" collection
        const providersRef = collection(db, 'providers')
        const snapshot = await getDocs(providersRef)

        const providerList = snapshot.docs.map((doc) => ({
          id: doc.id,       // Firebase document ID (replaces _id)
          ...doc.data(),    // All fields: first_name, last_name, bio, etc.
        }))

        setTherapists(providerList)
        setFilteredTherapists(providerList)
      } catch (err) {
        console.error('Failed to fetch providers from Firebase:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  // ===============================
  // START CHAT
  // ===============================
  const startChat = (therapistId) => {
    localStorage.setItem('activeTherapist', therapistId)
    router.push('/dashboard/chat')
  }

  // ===============================
  // FILTER LOGIC
  // ===============================
  useEffect(() => {
    let filtered = therapists

    // Search by first + last name combined, or bio
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => {
        const fullName = `${t.first_name || ''} ${t.last_name || ''}`.toLowerCase()
        const bio = (t.bio || '').toLowerCase()
        return fullName.includes(q) || bio.includes(q)
      })
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter((t) =>
        (t.specialization || []).includes(selectedSpecialty)
      )
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((t) => t.location === selectedLocation)
    }

    setFilteredTherapists(filtered)
  }, [searchQuery, selectedSpecialty, selectedLocation, therapists])

  // ===============================
  // AUTH CHECK
  // ===============================
  if (authLoading) {
    return <div className="p-10">Loading...</div>
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Find Your Therapist</h1>
          <p className="text-gray-600">
            Connect with real therapists on the platform
          </p>
        </div>

        {/* SEARCH */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search therapists..."
        />

        {/* SPECIALTY FILTERS — kept exactly as your original */}
        <SpecialtyFilters
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={setSelectedSpecialty}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* RESULTS COUNT */}
        {!isLoading && (
          <p className="text-sm text-gray-500">
            {filteredTherapists.length}{' '}
            {filteredTherapists.length === 1 ? 'therapist' : 'therapists'} found
          </p>
        )}

        {/* CONTENT */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="rounded-xl border border-slate-200 p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No therapists found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTherapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onChat={() => startChat(therapist.id)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
