'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistCard from '@/components/dashboard/therapists/TherapistCard'
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

  // ===============================
  // FETCH PROVIDERS FROM FIREBASE
  // ===============================
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true)

        // Pull every document from the "providers" collection
        const providersRef = collection(db, 'providers')
        const snapshot = await getDocs(providersRef)

        const providerList = snapshot.docs.map((doc) => ({
          id: doc.id,           // Firebase document ID
          ...doc.data(),        // All fields: first_name, last_name, etc.
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

    // Search by name or bio
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => {
        const fullName = `${t.first_name || ''} ${t.last_name || ''}`.toLowerCase()
        const bio = (t.bio || '').toLowerCase()
        return fullName.includes(q) || bio.includes(q)
      })
    }

    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter((t) =>
        (t.specialization || []).includes(selectedSpecialty)
      )
    }

    // Filter by location
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
            Connect with licensed providers on the platform
          </p>
        </div>

        {/* SEARCH */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search therapists by name..."
        />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Specialties</option>
            <option value="anxiety">Anxiety</option>
            <option value="depression">Depression</option>
            <option value="trauma">Trauma</option>
            <option value="couples">Couples Therapy</option>
            <option value="addiction">Addiction</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Locations</option>
            <option value="Kingston">Kingston</option>
            <option value="Montego Bay">Montego Bay</option>
            <option value="Spanish Town">Spanish Town</option>
            <option value="Online">Online</option>
          </select>
        </div>

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
            {/* Loading skeleton */}
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
