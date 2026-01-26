'use client'

import { useState, useEffect } from 'react'
import PrayerRequestModal from '@/components/ui/PrayerRequestModal'

export default function PrayerWall() {
  const [prayerRequests, setPrayerRequests] = useState([])
  const [myPrayers, setMyPrayers] = useState([])
  const [showPrayerModal, setShowPrayerModal] = useState(false)
  const [activeTab, setActiveTab] = useState('community')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrayers = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockCommunityPrayers = [
        {
          id: 1,
          name: 'Sarah M.',
          content: 'Praying for healing from anxiety and peace in my heart. The panic attacks have been overwhelming lately.',
          timestamp: '2 hours ago',
          prayers: 8,
          isAnonymous: false,
          category: 'anxiety'
        },
        {
          id: 2,
          name: 'Anonymous',
          content: 'Strength for my family as we navigate financial difficulties. Trusting God for provision.',
          timestamp: '5 hours ago',
          prayers: 12,
          isAnonymous: true,
          category: 'financial'
        },
        {
          id: 3,
          name: 'David T.',
          content: 'Wisdom in making an important career decision that will affect my family.',
          timestamp: '1 day ago',
          prayers: 15,
          isAnonymous: false,
          category: 'guidance'
        }
      ]

      const mockMyPrayers = [
        {
          id: 4,
          content: 'Peace in my relationships and healing from past hurts.',
          timestamp: '3 days ago',
          prayers: 3,
          category: 'relationships',
          isAnswered: false
        },
        {
          id: 5,
          content: 'Guidance for my daughter as she starts college next month.',
          timestamp: '1 week ago',
          prayers: 7,
          category: 'family',
          isAnswered: true
        }
      ]

      setPrayerRequests(mockCommunityPrayers)
      setMyPrayers(mockMyPrayers)
      setIsLoading(false)
    }

    fetchPrayers()
  }, [])

  const addPrayer = (prayerData) => {
    const newPrayer = {
      id: Date.now(),
      ...prayerData,
      timestamp: 'Just now',
      prayers: 0,
      isAnswered: false
    }
    
    if (prayerData.isPublic) {
      setPrayerRequests(prev => [newPrayer, ...prev])
    } else {
      setMyPrayers(prev => [newPrayer, ...prev])
    }
  }

  const prayForRequest = (id, isCommunity = true) => {
    if (isCommunity) {
      setPrayerRequests(prev => prev.map(prayer =>
        prayer.id === id ? { ...prayer, prayers: prayer.prayers + 1 } : prayer
      ))
    } else {
      setMyPrayers(prev => prev.map(prayer =>
        prayer.id === id ? { ...prayer, prayers: prayer.prayers + 1 } : prayer
      ))
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      financial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      guidance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      relationships: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      family: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prayer Wall
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your requests and pray for others in the community
          </p>
        </div>
        <button
          onClick={() => setShowPrayerModal(true)}
          className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          + Add Prayer Request
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          {[
            { id: 'community', name: 'Community Prayers', count: prayerRequests.length },
            { id: 'my-prayers', name: 'My Prayers', count: myPrayers.length },
            { id: 'answered', name: 'Answered Prayers', count: myPrayers.filter(p => p.isAnswered).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              {tab.name} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Prayer Requests */}
      <div className="space-y-4">
        {activeTab === 'community' && (
          <>
            {prayerRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No prayer requests yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Be the first to share a prayer request with the community.
                </p>
                <button
                  onClick={() => setShowPrayerModal(true)}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Share a prayer request
                </button>
              </div>
            ) : (
              prayerRequests.map(prayer => (
                <div key={prayer.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {prayer.isAnonymous ? 'A' : prayer.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {prayer.isAnonymous ? 'Anonymous' : prayer.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prayer.timestamp}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(prayer.category)}`}>
                      {prayer.category}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {prayer.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => prayForRequest(prayer.id)}
                      className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>Pray ({prayer.prayers})</span>
                    </button>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'my-prayers' && (
          <>
            {myPrayers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No personal prayers yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start by adding your first prayer request.
                </p>
                <button
                  onClick={() => setShowPrayerModal(true)}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Add prayer request
                </button>
              </div>
            ) : (
              myPrayers.map(prayer => (
                <div key={prayer.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(prayer.category)}`}>
                      {prayer.category}
                    </span>
                    {prayer.isAnswered && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        ✅ Answered
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {prayer.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{prayer.timestamp}</span>
                    <div className="flex items-center space-x-4">
                      <span>{prayer.prayers} prayers</span>
                      <button
                        onClick={() => prayForRequest(prayer.id, false)}
                        className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Pray Again
                      </button>
                      <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'answered' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Answered Prayers
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track how God has been faithful in answering your prayers.
            </p>
          </div>
        )}
      </div>

      {/* Prayer Modal */}
      <PrayerRequestModal
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        onSubmit={addPrayer}
      />
    </div>
  )
}