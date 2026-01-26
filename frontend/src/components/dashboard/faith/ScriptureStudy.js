'use client'

import { useState, useEffect } from 'react'
import FaithResourceCard from './FaithResourceCard'

export default function ScriptureStudy() {
  const [studies, setStudies] = useState([])
  const [featuredStudy, setFeaturedStudy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudies = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockStudies = [
        {
          id: 1,
          title: 'Psalms for Anxiety',
          description: 'Exploring Psalms that bring comfort and peace in times of anxiety and worry.',
          scripture: 'Psalm 23, 34, 46, 91',
          duration: '4 sessions',
          level: 'Beginner',
          category: 'anxiety',
          favorite: true,
          completed: 2,
          total: 4,
          image: '/images/faith/psalms-anxiety.jpg'
        },
        {
          id: 2,
          title: 'The Fruit of the Spirit',
          description: 'Deep dive into Galatians 5:22-23 and cultivating spiritual fruit in daily life.',
          scripture: 'Galatians 5:16-26',
          duration: '9 sessions',
          level: 'Intermediate',
          category: 'spiritual-growth',
          favorite: false,
          completed: 0,
          total: 9,
          image: '/images/faith/fruit-spirit.jpg'
        },
        {
          id: 3,
          title: 'Jesus and Mental Health',
          description: 'Examining how Jesus ministered to those with emotional and mental struggles.',
          scripture: 'Gospel Accounts',
          duration: '6 sessions',
          level: 'Intermediate',
          category: 'healing',
          favorite: false,
          completed: 6,
          total: 6,
          image: '/images/faith/jesus-mental-health.jpg'
        }
      ]

      const mockFeaturedStudy = {
        id: 4,
        title: 'Overcoming Fear with Faith',
        description: 'A comprehensive study on replacing fear with faith through Scripture.',
        scripture: '2 Timothy 1:7, Joshua 1:9, Psalm 27:1',
        duration: '5 sessions',
        level: 'All Levels',
        category: 'fear',
        favorite: false,
        completed: 0,
        total: 5,
        image: '/images/faith/overcoming-fear.jpg',
        isFeatured: true
      }

      setStudies(mockStudies)
      setFeaturedStudy(mockFeaturedStudy)
      setIsLoading(false)
    }

    fetchStudies()
  }, [])

  const markProgress = (id, progress) => {
    setStudies(prev => prev.map(study =>
      study.id === id ? { ...study, completed: progress } : study
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Featured Study */}
      {featuredStudy && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
            <div className="flex-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm mb-3">
                ⭐ Featured Study
              </span>
              <h2 className="text-2xl font-bold mb-2">{featuredStudy.title}</h2>
              <p className="text-purple-100 mb-4">{featuredStudy.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>📖 {featuredStudy.scripture}</span>
                <span>⏱️ {featuredStudy.duration}</span>
                <span>🎯 {featuredStudy.level}</span>
              </div>
              <div className="flex space-x-3 mt-6">
                <button className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Start Study
                </button>
                <button className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Save for Later
                </button>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 lg:w-48">
              <div className="w-full h-48 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-4xl">📚</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scripture Studies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Scripture Studies
          </h2>
          <div className="flex space-x-2">
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>All Categories</option>
              <option>Anxiety</option>
              <option>Depression</option>
              <option>Fear</option>
              <option>Hope</option>
            </select>
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studies.map(study => (
            <FaithResourceCard
              key={study.id}
              resource={study}
              type="study"
              onMarkProgress={(progress) => markProgress(study.id, progress)}
            />
          ))}
        </div>
      </div>

      {/* Study Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Study Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Bible Search',
              description: 'Search scriptures',
              icon: '🔍',
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: 'Reading Plans',
              description: 'Daily reading plans',
              icon: '📅',
              color: 'from-green-500 to-green-600'
            },
            {
              title: 'Verse of Day',
              description: 'Daily scripture',
              icon: '📖',
              color: 'from-purple-500 to-purple-600'
            },
            {
              title: 'Study Notes',
              description: 'Your personal notes',
              icon: '📝',
              color: 'from-orange-500 to-orange-600'
            }
          ].map((tool, index) => (
            <button
              key={index}
              className={`bg-gradient-to-r ${tool.color} text-white p-4 rounded-xl text-left hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <h3 className="font-semibold mb-1">{tool.title}</h3>
              <p className="text-white/80 text-sm">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}