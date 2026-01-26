'use client'

import { useState, useEffect } from 'react'
import FaithResourceCard from './FaithResourceCard'

export default function DailyDevotional() {
  const [devotionals, setDevotionals] = useState([])
  const [todaysDevotional, setTodaysDevotional] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDevotionals = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockDevotionals = [
        {
          id: 1,
          title: 'Strength in Weakness',
          scripture: '2 Corinthians 12:9-10',
          content: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness." Therefore I will boast all the more gladly about my weaknesses, so that Christ\'s power may rest on me.',
          reflection: 'God\'s strength shines brightest when we acknowledge our limitations. In our moments of greatest weakness, His power becomes most evident. Remember that your vulnerabilities are not obstacles to God\'s work but opportunities for His grace to manifest.',
          prayer: 'Heavenly Father, help me to embrace my weaknesses, knowing that Your power is made perfect in them. Teach me to rely not on my own strength but on Your sufficient grace. May Your power rest upon me today.',
          date: new Date().toISOString().split('T')[0],
          duration: '5 min',
          category: 'encouragement',
          favorite: false,
          completed: false
        },
        {
          id: 2,
          title: 'Peace That Surpasses',
          scripture: 'Philippians 4:6-7',
          content: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
          reflection: 'True peace comes not from the absence of trouble but from the presence of God in the midst of it. When anxiety threatens to overwhelm, prayer becomes our anchor.',
          prayer: 'Lord, in the midst of my worries and fears, help me to turn to You in prayer. Grant me the peace that surpasses all understanding to guard my heart and mind.',
          date: '2024-01-14',
          duration: '4 min',
          category: 'anxiety',
          favorite: true,
          completed: true
        },
        {
          id: 3,
          title: 'The Good Shepherd',
          scripture: 'Psalm 23:1-3',
          content: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
          reflection: 'In the busyness of life, remember that God desires to lead you to places of rest and refreshment. Allow Him to guide you to the quiet waters your soul needs.',
          prayer: 'Shepherd of my soul, lead me today to the green pastures and quiet waters where You restore my soul. Help me to trust Your guidance and find rest in Your care.',
          date: '2024-01-13',
          duration: '6 min',
          category: 'rest',
          favorite: false,
          completed: true
        }
      ]

      const mockTodaysDevotional = {
        id: 4,
        title: 'New Every Morning',
        scripture: 'Lamentations 3:22-23',
        content: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.',
        reflection: 'Each sunrise brings with it the promise of God\'s renewed compassion and faithfulness. No matter what yesterday held, today offers a fresh start filled with God\'s mercies.',
        prayer: 'Faithful God, thank You for Your mercies that are new every morning. Help me to approach this day with hope, knowing of Your great love and faithfulness that never fails.',
        date: new Date().toISOString().split('T')[0],
        duration: '5 min',
        category: 'hope',
        favorite: false,
        completed: false,
        isToday: true
      }

      setDevotionals(mockDevotionals)
      setTodaysDevotional(mockTodaysDevotional)
      setIsLoading(false)
    }

    fetchDevotionals()
  }, [])

  const markAsRead = (id) => {
    setDevotionals(prev => prev.map(devotional => 
      devotional.id === id ? { ...devotional, completed: true } : devotional
    ))
    if (todaysDevotional?.id === id) {
      setTodaysDevotional(prev => prev ? { ...prev, completed: true } : null)
    }
  }

  const toggleFavorite = (id) => {
    setDevotionals(prev => prev.map(devotional => 
      devotional.id === id ? { ...devotional, favorite: !devotional.favorite } : devotional
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Today's Devotional */}
      {todaysDevotional && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mb-2">
                📅 Today&apos;s Devotional
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {todaysDevotional.title}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                {todaysDevotional.scripture}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {todaysDevotional.duration}
              </span>
              <button
                onClick={() => toggleFavorite(todaysDevotional.id)}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                {todaysDevotional.favorite ? (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scripture</h3>
              <p className="text-gray-700 dark:text-gray-300 italic">
                &quot;{todaysDevotional.content}&quot;
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reflection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {todaysDevotional.reflection}
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prayer</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {todaysDevotional.prayer}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => markAsRead(todaysDevotional.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Mark as Read
            </button>
            <button className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-3 rounded-lg font-semibold transition-colors">
              Save for Later
            </button>
          </div>
        </div>
      )}

      {/* Recent Devotionals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Devotionals
          </h2>
          <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devotionals.map(devotional => (
            <FaithResourceCard
              key={devotional.id}
              resource={devotional}
              type="devotional"
              onMarkComplete={() => markAsRead(devotional.id)}
              onToggleFavorite={() => toggleFavorite(devotional.id)}
            />
          ))}
        </div>
      </div>

      {/* Devotional Series */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Devotional Series
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Overcoming Anxiety',
              description: '7-day series on finding peace',
              progress: 3,
              total: 7,
              icon: '🕊️'
            },
            {
              title: 'Psalms of Comfort',
              description: 'Exploring comfort in Psalms',
              progress: 0,
              total: 5,
              icon: '📖'
            },
            {
              title: 'Fruit of the Spirit',
              description: 'Cultivating spiritual fruit',
              progress: 5,
              total: 9,
              icon: '🌱'
            }
          ].map((series, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{series.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{series.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{series.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white">{series.progress}/{series.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(series.progress / series.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                {series.progress === 0 ? 'Start Series' : 'Continue'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}