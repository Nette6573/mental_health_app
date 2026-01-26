'use client'

import { useState, useEffect } from 'react'

export default function ProgressTracker({ 
  type = 'spiritual', 
  current = 0, 
  total = 7, 
  title, 
  subtitle,
  showStreak = true,
  size = 'medium',
  onComplete 
}) {
  const [progress, setProgress] = useState(current)
  const [isAnimating, setIsAnimating] = useState(false)

  const percentage = total > 0 ? Math.min((progress / total) * 100, 100) : 0
  const isComplete = progress >= total

  useEffect(() => {
    setProgress(current)
  }, [current])

  const incrementProgress = () => {
    if (progress < total) {
      setIsAnimating(true)
      setProgress(prev => {
        const newProgress = prev + 1
        if (newProgress >= total && onComplete) {
          setTimeout(() => onComplete(), 300)
        }
        return newProgress
      })
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-2 text-sm'
      case 'large':
        return 'h-4 text-lg'
      default:
        return 'h-3 text-base'
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'spiritual':
        return 'from-purple-500 to-pink-600'
      case 'prayer':
        return 'from-blue-500 to-cyan-600'
      case 'scripture':
        return 'from-green-500 to-emerald-600'
      case 'community':
        return 'from-orange-500 to-red-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'spiritual':
        return '💫'
      case 'prayer':
        return '🙏'
      case 'scripture':
        return '📖'
      case 'community':
        return '👥'
      default:
        return '⭐'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon()}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title || `${type.charAt(0).toUpperCase() + type.slice(1)} Progress`}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        
        {showStreak && progress > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              🔥 {progress}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">day streak</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}/{total} ({Math.round(percentage)}%)</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getTypeColor()} ${getSizeClasses()} rounded-full transition-all duration-500 ease-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Completion Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isComplete ? (
            <>
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Completed! 🎉
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {total - progress} {type === 'scripture' ? 'chapters' : 'days'} remaining
            </span>
          )}
        </div>

        {!isComplete && (
          <button
            onClick={incrementProgress}
            disabled={isComplete}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isComplete
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r ${getTypeColor()} text-white hover:shadow-md transform hover:scale-105`
            }`}
          >
            Mark Complete
          </button>
        )}
      </div>

      {/* Weekly Progress */}
      {type === 'spiritual' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>This week</span>
            <span>{progress}/7 days</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded ${
                  i < progress
                    ? `bg-gradient-to-b ${getTypeColor()}`
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Progress Dashboard Component
export function ProgressDashboard({ userId }) {
  const [progressData, setProgressData] = useState({
    spiritual: { current: 3, total: 7, streak: 3 },
    prayer: { current: 12, total: 21, streak: 5 },
    scripture: { current: 45, total: 100, streak: 7 },
    community: { current: 8, total: 15, streak: 2 }
  })

  const overallProgress = Object.values(progressData).reduce(
    (acc, { current, total }) => acc + (current / total), 0
  ) / Object.keys(progressData).length * 100

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Spiritual Journey</h2>
            <p className="text-purple-100">Overall Progress</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-purple-100 text-sm">Complete</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressTracker
          type="spiritual"
          current={progressData.spiritual.current}
          total={progressData.spiritual.total}
          title="Spiritual Practices"
          subtitle="Daily devotionals & prayer"
          showStreak={true}
        />
        <ProgressTracker
          type="prayer"
          current={progressData.prayer.current}
          total={progressData.prayer.total}
          title="Prayer Journey"
          subtitle="Consistent prayer life"
          showStreak={true}
        />
        <ProgressTracker
          type="scripture"
          current={progressData.scripture.current}
          total={progressData.scripture.total}
          title="Scripture Reading"
          subtitle="Bible reading plan"
          showStreak={true}
        />
        <ProgressTracker
          type="community"
          current={progressData.community.current}
          total={progressData.community.total}
          title="Community Engagement"
          subtitle="Prayer & encouragement"
          showStreak={true}
        />
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🏆 Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: '7-Day Streak', icon: '🔥', date: '2 days ago', type: 'spiritual' },
            { name: 'Prayer Warrior', icon: '🙏', date: '1 week ago', type: 'prayer' },
            { name: 'Bible Reader', icon: '📖', date: '3 days ago', type: 'scripture' }
          ].map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}