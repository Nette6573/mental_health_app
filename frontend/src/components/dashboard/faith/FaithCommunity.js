'use client'

import { useState, useEffect } from 'react'

export default function FaithCommunity() {
  const [communityMembers, setCommunityMembers] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [activeTab, setActiveTab] = useState('discussions')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCommunityData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockMembers = [
        {
          id: 1,
          name: 'Sarah Johnson',
          role: 'Prayer Warrior',
          avatar: '/avatars/sarah.jpg',
          isOnline: true,
          lastActive: '2 min ago',
          prayerCount: 47,
          encouragingWords: 23
        },
        {
          id: 2,
          name: 'Michael Chen',
          role: 'Bible Study Leader',
          avatar: '/avatars/michael.jpg',
          isOnline: false,
          lastActive: '1 hour ago',
          prayerCount: 32,
          encouragingWords: 18
        },
        {
          id: 3,
          name: 'Emily Davis',
          role: 'Encourager',
          avatar: '/avatars/emily.jpg',
          isOnline: true,
          lastActive: '5 min ago',
          prayerCount: 28,
          encouragingWords: 42
        },
        {
          id: 4,
          name: 'David Wilson',
          role: 'New Believer',
          avatar: '/avatars/david.jpg',
          isOnline: false,
          lastActive: '3 hours ago',
          prayerCount: 12,
          encouragingWords: 8
        }
      ]

      const mockDiscussions = [
        {
          id: 1,
          title: 'Finding peace in anxious times',
          content: 'How do you maintain peace when everything feels overwhelming? Looking for practical tips from Scripture.',
          author: 'Sarah Johnson',
          timestamp: '2 hours ago',
          replies: 8,
          likes: 12,
          category: 'anxiety',
          isPinned: true
        },
        {
          id: 2,
          title: 'Daily prayer routine suggestions?',
          content: 'Trying to establish a consistent prayer routine. What has worked for you all?',
          author: 'Michael Chen',
          timestamp: '5 hours ago',
          replies: 15,
          likes: 21,
          category: 'prayer',
          isPinned: false
        },
        {
          id: 3,
          title: 'Favorite Psalms for comfort',
          content: 'Share your go-to Psalms when you need comfort and reassurance.',
          author: 'Emily Davis',
          timestamp: '1 day ago',
          replies: 23,
          likes: 34,
          category: 'scripture',
          isPinned: false
        }
      ]

      setCommunityMembers(mockMembers)
      setDiscussions(mockDiscussions)
      setIsLoading(false)
    }

    fetchCommunityData()
  }, [])

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      prayer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      scripture: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      testimony: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      support: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-20"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-indigo-100 text-sm">Community Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">892</div>
            <div className="text-indigo-100 text-sm">Prayers Offered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">347</div>
            <div className="text-indigo-100 text-sm">Discussions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-indigo-100 text-sm">Online Now</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {[
                { id: 'discussions', name: 'Discussions', icon: '💬' },
                { id: 'prayer-requests', name: 'Prayer Requests', icon: '🙏' },
                { id: 'testimonies', name: 'Testimonies', icon: '✨' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2
                    ${activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discussion List */}
          <div className="space-y-4">
            {discussions.map(discussion => (
              <div key={discussion.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                {discussion.isPinned && (
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 17.5a.5.5 0 01-1 0V2.914l-.646-.647a.5.5 0 01.708-.708l1.5 1.5a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708-.708L4.5 2.914V17.5z"/>
                    </svg>
                    Pinned Discussion
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {discussion.content}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(discussion.category)}`}>
                    {discussion.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>By {discussion.author}</span>
                    <span>{discussion.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{discussion.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{discussion.replies}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start Discussion Button */}
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Start New Discussion</span>
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Online Members */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Online Now
            </h3>
            <div className="space-y-3">
              {communityMembers.filter(member => member.isOnline).map(member => (
                <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {member.name[0]}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              🤝 Community Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Be kind and compassionate</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Respect different perspectives</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Maintain confidentiality</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Offer support, not advice</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <span className="text-lg">🙏</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pray for Someone</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <span className="text-lg">💫</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Share Testimony</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <span className="text-lg">👥</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Find Accountability</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}