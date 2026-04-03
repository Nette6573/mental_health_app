'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import WelcomeBanner from '@/components/dashboard/overview/WelcomeBanner'
import StatsCards from '@/components/dashboard/overview/StatsCards'
import MoodTracker from '@/components/dashboard/overview/MoodTracker'
import RecentActivity from '@/components/dashboard/overview/RecentActivity'
import QuickActions from '@/components/dashboard/overview/QuickActions'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [userData, setUserData] = useState(null)
  const [phq9Data, setPhq9Data] = useState([])
  const [moodData, setMoodData] = useState([])

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const uid = localStorage.getItem("uid")
    if (!uid) return

    // PHQ9 DATA
    fetch(`http://127.0.0.1:8000/api/user/${uid}/assessments`)
      .then(res => res.json())
      .then(data => {
        setPhq9Data(data.phq9 || [])
      })
      .catch(err => console.error(err))

    // USER DATA (for mood later)
    fetch(`http://127.0.0.1:8000/api/user/${uid}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data)
        setMoodData(data.mood_log || [])
      })
      .catch(err => console.error(err))

  }, [])

  // ---------------- HELPERS ----------------
  function getColor(score) {
    if (score <= 4) return "text-green-500"
    if (score <= 9) return "text-yellow-500"
    if (score <= 14) return "text-orange-500"
    return "text-red-500"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* Welcome */}
        <WelcomeBanner user={userData || user} />

        {/* Stats */}
        <StatsCards userData={userData} />

        {/* PHQ9 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border">
          <h3 className="text-lg font-semibold mb-4">
            Mental Health Assessment
          </h3>

          {phq9Data.length === 0 ? (
            <p>No assessments yet</p>
          ) : (
            phq9Data.slice(-1).map((item, index) => (
              <div key={index}>
                <p className={getColor(item.score)}>
                  Score: {item.score}
                </p>
                <p>Level: {item.level}</p>

                {item.score >= 10 ? (
                  <p className="text-red-500 mt-2">
                    We recommend speaking with a professional.
                  </p>
                ) : (
                  <p className="text-green-500 mt-2">
                    Keep using self-help tools.
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <Link href="/dashboard/therapists">
                    <button className="bg-blue-500 text-white px-3 py-2 rounded">
                      Talk to Therapist
                    </button>
                  </Link>

                  <Link href="/dashboard/resources">
                    <button className="bg-green-500 text-white px-3 py-2 rounded">
                      Resources
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTracker moodData={moodData} />
            <RecentActivity />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <QuickActions />

            {/* Weekly Insight (kept, Paula card removed) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Insight
              </h3>
              <p className="text-sm">
                You're making progress. Small steps still count.
              </p>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}