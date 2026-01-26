'use client'

import { useState, useEffect } from 'react'

export default function ProgressAchievements({ user, data }) {
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Mock achievements data
    const mockAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first devotional',
        icon: '👣',
        category: 'getting_started',
        progress: 100,
        required: 1,
        current: 1,
        unlocked: true,
        unlockedAt: '2024-01-01',
        points: 10
      },
      {
        id: 2,
        title: 'Prayer Warrior',
        description: 'Pray for 10 different people',
        icon: '🙏',
        category: 'prayer',
        progress: 80,
        required: 10,
        current: 8,
        unlocked: false,
        points: 25
      },
      {
        id: 3,
        title: 'Scripture Scholar',
        description: 'Read 50 chapters of the Bible',
        icon: '📚',
        category: 'scripture',
        progress: 60,
        required: 50,
        current: 30,
        unlocked: false,
        points: 50
      },
      {
        id: 4,
        title: 'Community Builder',
        description: 'Engage with 25 community posts',
        icon: '👥',
        category: 'community',
        progress: 40,
        required: 25,
        current: 10,
        unlocked: false,
        points: 30
      },
      {
        id: 5,
        title: 'Consistency Champion',
        description: '7-day activity streak',
        icon: '🔥',
        category: 'consistency',
        progress: 100,
        required: 7,
        current: 7,
        unlocked: true,
        unlockedAt: '2024-01-15',
        points: 20
      },
      {
        id: 6,
        title: 'Early Riser',
        description: 'Complete 5 morning devotionals before 8 AM',
        icon: '🌅',
        category: 'habits',
        progress: 60,
        required: 5,
        current: 3,
        unlocked: false,
        points: 15
      },
      {
        id: 7,
        title: 'Encourager',
        description: 'Send 15 words of encouragement',
        icon: '💝',
        category: 'community',
        progress: 20,
        required: 15,
        current: 3,
        unlocked: false,
        points: 25
      },
      {
        id: 8,
        title: 'Bible Explorer',
        description: 'Read from 5 different books of the Bible',
        icon: '🗺️',
        category: 'scripture',
        progress: 80,
        required: 5,
        current: 4,
        unlocked: false,
        points: 35
      }
    ]

    const mockStats = {
      totalPoints: 30,
      unlockedCount: 2,
      totalAchievements: 8,
      nextMilestone: 'Prayer Warrior (25 points)'
    }

    setAchievements(mockAchievements)
    setStats(mockStats)
  }, [])

  const categories = [
    { id: 'all', name: 'All Achievements', icon: '🏆' },
    { id: 'getting_started', name: 'Getting Started', icon: '👣' },
    { id: 'prayer', name: 'Prayer', icon: '🙏' },
    { id: 'scripture', name: 'Scripture', icon: '📚' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'consistency', name: 'Consistency', icon: '🔥' },
    { id: 'habits', name: 'Habits', icon: '🌅' }
  ]

  const [activeCategory, setActiveCategory] = useState('all')

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === activeCategory)

  const AchievementCard = ({ achievement }) => (
    <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
      achievement.unlocked
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Unlocked Badge */}
      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
            <span>🏆</span>
            <span>Unlocked!</span>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
          achievement.unlocked
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
        }`}>
          {achievement.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${
            achievement.unlocked
              ? 'text-yellow-800 dark:text-yellow-300'
              : 'text-gray-900 dark:text-white'
          }`}>
            {achievement.title}
          </h3>
          
          <p className={`text-sm mt-1 ${
            achievement.unlocked
              ? 'text-yellow-700 dark:text-yellow-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {achievement.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className={achievement.unlocked ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}>
                Progress
              </span>
              <span className={`font-medium ${
                achievement.unlocked
                  ? 'text-yellow-800 dark:text-yellow-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {achievement.current}/{achievement.required}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  achievement.unlocked
                    ? 'bg-yellow-500'
                    : 'bg-primary-500'
                }`}
                style={{ width: `${achievement.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Points and Unlock Date */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1 text-sm">
              <span className={achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}>
                ⭐
              </span>
              <span className={achievement.unlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'}>
                {achievement.points} points
              </span>
            </div>
            
            {achievement.unlocked && achievement.unlockedAt && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <div className="text-3xl font-bold">{stats.totalPoints}</div>
          <div className="text-primary-100">Total Points</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.unlockedCount}</div>
          <div className="text-gray-600 dark:text-gray-400">Achievements Unlocked</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAchievements}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Available</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {stats.nextMilestone}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Next Milestone</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-4xl mb-4 block">🎉</span>
          <h3 className="text-2xl font-bold mb-4">Keep Going!</h3>
          <p className="text-purple-100 text-lg mb-6">
            Every step in your spiritual journey brings you closer to God and deeper in faith. 
            Your consistency is inspiring!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round((stats.unlockedCount / stats.totalAchievements) * 100)}%</div>
              <div className="text-purple-200 text-sm">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <div className="text-purple-200 text-sm">Points Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Share Your Progress
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Inspire others by sharing your spiritual journey achievements
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
            <span>📱</span>
            <span>Share on Social Media</span>
          </button>
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  )
}