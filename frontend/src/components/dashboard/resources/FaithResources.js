'use client'

import { useState, useEffect } from 'react'
import ResourceCard from './ResourceCard'

const faithCategories = [
  { id: 'all', name: 'All Resources' },
  { id: 'devotionals', name: 'Daily Devotionals' },
  { id: 'prayer', name: 'Prayer Guides' },
  { id: 'scripture', name: 'Scripture Studies' },
  { id: 'testimonies', name: 'Testimonies' },
  { id: 'worship', name: 'Worship & Music' }
]

export default function FaithResources() {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchFaithResources = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock faith resources data
      const mockResources = [
        {
          id: 1,
          title: 'Strength in Weakness Devotional',
          description: 'A 7-day devotional exploring how God\'s strength is made perfect in our weakness, with practical applications for mental health struggles.',
          category: 'devotionals',
          type: 'article',
          duration: '7 days',
          level: 'All Levels',
          image: '/images/faith/strength-devotional.jpg',
          rating: 4.9,
          reviews: 234,
          featured: true,
          tags: ['Devotional', 'Strength', 'Hope', '2 Corinthians 12:9']
        },
        {
          id: 2,
          title: 'Prayers for Anxiety and Peace',
          description: 'Guided prayers and scripture meditations specifically designed for moments of anxiety and seeking God\'s peace.',
          category: 'prayer',
          type: 'audio',
          duration: '15 min',
          level: 'Beginner',
          image: '/images/faith/prayer-guide.jpg',
          rating: 4.8,
          reviews: 167,
          featured: true,
          tags: ['Prayer', 'Anxiety', 'Peace', 'Philippians 4:6-7']
        },
        {
          id: 3,
          title: 'Psalms for the Heavy Heart',
          description: 'A deep dive into the Psalms that speak to depression, sorrow, and finding comfort in God\'s presence.',
          category: 'scripture',
          type: 'course',
          duration: '5 modules',
          level: 'Intermediate',
          image: '/images/faith/psalms-study.jpg',
          rating: 4.7,
          reviews: 89,
          featured: false,
          tags: ['Psalms', 'Depression', 'Comfort', 'Scripture Study']
        },
        {
          id: 4,
          title: 'From Broken to Beautiful',
          description: 'Powerful testimonies of individuals who found healing and purpose through their faith journey with mental health challenges.',
          category: 'testimonies',
          type: 'video',
          duration: '45 min',
          level: 'All Levels',
          image: '/images/faith/testimonies.jpg',
          rating: 5.0,
          reviews: 56,
          featured: false,
          tags: ['Testimony', 'Healing', 'Hope', 'Inspiration']
        },
        {
          id: 5,
          title: 'Worship for the Weary Soul',
          description: 'Curated worship music and hymns that bring comfort and peace to tired and anxious hearts.',
          category: 'worship',
          type: 'audio',
          duration: '60 min',
          level: 'Beginner',
          image: '/images/faith/worship-music.jpg',
          rating: 4.9,
          reviews: 178,
          featured: true,
          tags: ['Worship', 'Music', 'Comfort', 'Peace']
        },
        {
          id: 6,
          title: 'Biblical Meditation Guide',
          description: 'Learn how to practice Christian meditation using Scripture to calm your mind and connect with God.',
          category: 'prayer',
          type: 'worksheet',
          duration: '10 min daily',
          level: 'Beginner',
          image: '/images/faith/meditation-guide.jpg',
          rating: 4.6,
          reviews: 92,
          featured: false,
          tags: ['Meditation', 'Scripture', 'Mindfulness', 'Practice']
        }
      ]
      
      setResources(mockResources)
      setIsLoading(false)
    }

    fetchFaithResources()
  }, [])

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🙏</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Faith-Based Support</h2>
            <p className="text-purple-100">
              Find comfort, strength, and hope through biblical resources and spiritual practices
            </p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {faithCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${selectedCategory === category.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Featured Faith Resources */}
      {filteredResources.filter(r => r.featured).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Featured Resources
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredResources
              .filter(resource => resource.featured)
              .map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isFavorite={false}
                  onFavorite={() => {}}
                  featured
                />
              ))}
          </div>
        </div>
      )}

      {/* All Faith Resources */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Faith Resources
        </h3>
        
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources in this category
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category or check back soon for new resources.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isFavorite={false}
                onFavorite={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Verse */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
            📖 Daily Scripture
          </h4>
          <blockquote className="text-xl text-blue-900 dark:text-blue-200 italic mb-4">
            &quot;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.&quot;
          </blockquote>
          <p className="text-blue-700 dark:text-blue-400 font-medium">
            Philippians 4:6-7
          </p>
        </div>
      </div>
    </div>
  )
}