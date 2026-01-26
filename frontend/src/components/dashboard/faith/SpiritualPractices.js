'use client'

import { useState, useEffect } from 'react'

export default function SpiritualPractices() {
  const [practices, setPractices] = useState([])
  const [activePractice, setActivePractice] = useState(null)
  const [practiceProgress, setPracticeProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPractices = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockPractices = [
        {
          id: 1,
          title: 'Centering Prayer',
          description: 'A method of silent prayer that prepares us to receive the gift of contemplative prayer.',
          duration: '10-20 minutes',
          frequency: 'Daily',
          difficulty: 'Beginner',
          category: 'prayer',
          benefits: ['Reduces anxiety', 'Increases mindfulness', 'Deepens spiritual connection'],
          steps: [
            'Choose a sacred word as the symbol of your intention to consent to God\'s presence and action within.',
            'Sitting comfortably and with eyes closed, settle briefly and silently introduce the sacred word.',
            'When engaged with your thoughts, return ever-so-gently to the sacred word.',
            'At the end of the prayer period, remain in silence with eyes closed for a couple of minutes.'
          ],
          scripture: 'Be still, and know that I am God. - Psalm 46:10'
        },
        {
          id: 2,
          title: 'Lectio Divina',
          description: 'A traditional Benedictine practice of scriptural reading, meditation and prayer.',
          duration: '20-30 minutes',
          frequency: 'Daily',
          difficulty: 'Intermediate',
          category: 'scripture',
          benefits: ['Deepens scripture understanding', 'Enhances meditation', 'Promotes spiritual growth'],
          steps: [
            'Read (Lectio): Slowly read a Scripture passage several times.',
            'Meditate (Meditatio): Reflect on the text and ponder it slowly.',
            'Pray (Oratio): Respond to the passage by opening your heart to God.',
            'Contemplate (Contemplatio): Rest in God\'s presence and listen.'
          ],
          scripture: 'Your word is a lamp for my feet, a light on my path. - Psalm 119:105'
        },
        {
          id: 3,
          title: 'Examen Prayer',
          description: 'A technique of prayerful reflection on the events of the day to detect God\'s presence.',
          duration: '10-15 minutes',
          frequency: 'Daily',
          difficulty: 'Beginner',
          category: 'reflection',
          benefits: ['Increases awareness', 'Promotes gratitude', 'Helps discernment'],
          steps: [
            'Become aware of God\'s presence and look back at the day with gratitude.',
            'Review the day and pay attention to your emotions and feelings.',
            'Choose one feature of the day and pray from it.',
            'Look toward tomorrow and ask God for guidance and strength.'
          ],
          scripture: 'Search me, God, and know my heart; test me and know my anxious thoughts. - Psalm 139:23'
        },
        {
          id: 4,
          title: 'Breath Prayer',
          description: 'A short, simple prayer that is repeated throughout the day, often synchronized with breathing.',
          duration: '5-10 minutes',
          frequency: 'Multiple times daily',
          difficulty: 'Beginner',
          category: 'mindfulness',
          benefits: ['Reduces stress', 'Maintains spiritual focus', 'Easy to practice anywhere'],
          steps: [
            'Choose a short prayer phrase (e.g., "Lord Jesus, have mercy")',
            'Inhale on the first part ("Lord Jesus")',
            'Exhale on the second part ("have mercy")',
            'Repeat throughout the day whenever you need to center yourself'
          ],
          scripture: 'Pray without ceasing. - 1 Thessalonians 5:17'
        }
      ]

      setPractices(mockPractices)
      setPracticeProgress({
        1: { currentStreak: 3, totalSessions: 12, lastPractice: '2024-01-15' },
        2: { currentStreak: 0, totalSessions: 5, lastPractice: '2024-01-10' },
        3: { currentStreak: 7, totalSessions: 25, lastPractice: '2024-01-15' },
        4: { currentStreak: 14, totalSessions: 45, lastPractice: '2024-01-15' }
      })
      setIsLoading(false)
    }

    fetchPractices()
  }, [])

  const startPractice = (practiceId) => {
    setActivePractice(practices.find(p => p.id === practiceId))
  }

  const completePractice = (practiceId) => {
    const progress = practiceProgress[practiceId] || { currentStreak: 0, totalSessions: 0 }
    const today = new Date().toISOString().split('T')[0]
    
    setPracticeProgress(prev => ({
      ...prev,
      [practiceId]: {
        currentStreak: progress.lastPractice === today ? progress.currentStreak : progress.currentStreak + 1,
        totalSessions: progress.totalSessions + 1,
        lastPractice: today
      }
    }))
    
    setActivePractice(null)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      prayer: '🙏',
      scripture: '📖',
      reflection: '💭',
      mindfulness: '🌬️',
      worship: '🎵'
    }
    return icons[category] || '✨'
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
          ))}
        </div>
      </div>
    )
  }

  if (activePractice) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActivePractice(null)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Practices</span>
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(activePractice.difficulty)}`}>
            {activePractice.difficulty}
          </span>
        </div>

        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">{getCategoryIcon(activePractice.category)}</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {activePractice.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {activePractice.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Practice Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Practice Steps</h3>
            <div className="space-y-4">
              {activePractice.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Details */}
          <div className="space-y-6">
            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Benefits</h3>
              <div className="space-y-2">
                {activePractice.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scripture */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Related Scripture</h3>
              <p className="text-blue-700 dark:text-blue-400 italic">{activePractice.scripture}</p>
            </div>

            {/* Practice Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {activePractice.duration}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {activePractice.frequency}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Frequency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => completePractice(activePractice.id)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
          >
            Complete Practice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Spiritual Practices
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Ancient practices for modern spiritual growth. Develop habits that deepen your relationship with God.
        </p>
      </div>

      {/* Practices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practices.map(practice => {
          const progress = practiceProgress[practice.id] || { currentStreak: 0, totalSessions: 0 }
          
          return (
            <div key={practice.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(practice.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(practice.difficulty)}`}>
                    {practice.difficulty}
                  </span>
                </div>
                {progress.currentStreak > 0 && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      🔥 {progress.currentStreak} day streak
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.totalSessions} total sessions
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {practice.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {practice.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>⏱️ {practice.duration}</span>
                <span>📅 {practice.frequency}</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => startPractice(practice.id)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {progress.totalSessions > 0 ? 'Practice Again' : 'Start Practice'}
                </button>
                
                {progress.totalSessions > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((progress.totalSessions / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Practice Stats */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Your Practice Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">18</div>
            <div className="text-purple-100 text-sm">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">7</div>
            <div className="text-purple-100 text-sm">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-purple-100 text-sm">Active Practices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">87%</div>
            <div className="text-purple-100 text-sm">Consistency</div>
          </div>
        </div>
      </div>
    </div>
  )
}