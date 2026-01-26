'use client'

import { useState, useEffect } from 'react'
import ResourceCard from './ResourceCard'
import SearchBar from './SearchBar'
import ResourceFilter from './ResourceFilter'

const categories = [
  { id: 'all', name: 'All Resources', count: 0 },
  { id: 'anxiety', name: 'Anxiety', count: 12 },
  { id: 'depression', name: 'Depression', count: 8 },
  { id: 'stress', name: 'Stress Management', count: 15 },
  { id: 'relationships', name: 'Relationships', count: 6 },
  { id: 'self-care', name: 'Self-Care', count: 10 },
  { id: 'faith', name: 'Faith & Spirituality', count: 7 },
  { id: 'crisis', name: 'Crisis Support', count: 5 }
]

const resourceTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'article', name: 'Articles' },
  { id: 'video', name: 'Videos' },
  { id: 'audio', name: 'Audio Guides' },
  { id: 'worksheet', name: 'Worksheets' },
  { id: 'course', name: 'Courses' }
]

export default function ResourceLibrary() {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [favorites, setFavorites] = useState(new Set())

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock resources data
      const mockResources = [
        {
          id: 1,
          title: 'Understanding Anxiety Disorders',
          description: 'A comprehensive guide to understanding different types of anxiety disorders, their symptoms, and evidence-based treatment approaches.',
          category: 'anxiety',
          type: 'article',
          duration: '15 min read',
          level: 'Beginner',
          image: '/images/resources/anxiety-guide.jpg',
          rating: 4.8,
          reviews: 124,
          featured: true,
          tags: ['Anxiety', 'Mental Health', 'Education']
        },
        {
          id: 2,
          title: 'Mindfulness Meditation for Stress',
          description: 'Guided meditation sessions designed to help reduce stress and promote mindfulness in daily life.',
          category: 'stress',
          type: 'audio',
          duration: '20 min',
          level: 'All Levels',
          image: '/images/resources/meditation.jpg',
          rating: 4.9,
          reviews: 89,
          featured: true,
          tags: ['Meditation', 'Mindfulness', 'Stress Relief']
        },
        {
          id: 3,
          title: 'Cognitive Behavioral Therapy Basics',
          description: 'Learn the fundamental principles of CBT and how to apply them to manage negative thought patterns.',
          category: 'depression',
          type: 'course',
          duration: '6 modules',
          level: 'Intermediate',
          image: '/images/resources/cbt-course.jpg',
          rating: 4.7,
          reviews: 203,
          featured: false,
          tags: ['CBT', 'Therapy', 'Skills']
        },
        {
          id: 4,
          title: 'Daily Self-Care Checklist',
          description: 'Printable worksheet to track your daily self-care activities and build healthy habits.',
          category: 'self-care',
          type: 'worksheet',
          duration: '5 min daily',
          level: 'Beginner',
          image: '/images/resources/self-care.jpg',
          rating: 4.6,
          reviews: 67,
          featured: false,
          tags: ['Self-Care', 'Worksheet', 'Habits']
        },
        {
          id: 5,
          title: 'Finding Strength in Faith',
          description: 'Exploring how spiritual practices can support mental wellness and provide comfort during difficult times.',
          category: 'faith',
          type: 'article',
          duration: '12 min read',
          level: 'All Levels',
          image: '/images/resources/faith-strength.jpg',
          rating: 4.9,
          reviews: 156,
          featured: true,
          tags: ['Faith', 'Spirituality', 'Hope']
        },
        {
          id: 6,
          title: 'Crisis Coping Strategies',
          description: 'Immediate techniques and resources for managing mental health crises and emergency situations.',
          category: 'crisis',
          type: 'video',
          duration: '25 min',
          level: 'All Levels',
          image: '/images/resources/crisis-support.jpg',
          rating: 4.8,
          reviews: 92,
          featured: true,
          tags: ['Crisis', 'Emergency', 'Support']
        }
      ]
      
      setResources(mockResources)
      setFilteredResources(mockResources)
      setIsLoading(false)
    }

    fetchResources()
  }, [])

  // Filter resources based on search and filters
  useEffect(() => {
    let filtered = resources

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    setFilteredResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, resources])

  const handleFavorite = (resourceId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(resourceId)) {
        newFavorites.delete(resourceId)
      } else {
        newFavorites.add(resourceId)
      }
      return newFavorites
    })
  }

  const getTypeIcon = (type) => {
    const icons = {
      article: '📄',
      video: '🎥',
      audio: '🎧',
      worksheet: '📝',
      course: '🎓'
    }
    return icons[type] || '📚'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search resources, topics, or keywords..."
            />
          </div>
          <div className="flex space-x-4">
            <ResourceFilter
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <ResourceFilter
              label="Type"
              options={resourceTypes}
              value={selectedType}
              onChange={setSelectedType}
            />
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 hover:text-primary-600"
              >
                ×
              </button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {resourceTypes.find(t => t.id === selectedType)?.name}
              <button
                onClick={() => setSelectedType('all')}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {(selectedCategory !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
                setSearchQuery('')
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Featured Resources */}
      {filteredResources.filter(r => r.featured).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredResources
              .filter(resource => resource.featured)
              .map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isFavorite={favorites.has(resource.id)}
                  onFavorite={() => handleFavorite(resource.id)}
                  featured
                />
              ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Resources
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredResources.length} resources found
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedType('all')
              }}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isFavorite={favorites.has(resource.id)}
                onFavorite={() => handleFavorite(resource.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}