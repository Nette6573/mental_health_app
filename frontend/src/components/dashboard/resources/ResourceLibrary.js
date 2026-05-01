'use client'

import { useState, useEffect } from 'react'
import ResourceCard from './ResourceCard'
import SearchBar from './SearchBar'
import ResourceFilter from './ResourceFilter'
import ResourceViewerModal from './ResourceViewerModal'

const categories = [
  { id: 'all', name: 'All Resources' },
  { id: 'anxiety', name: 'Anxiety' },
  { id: 'depression', name: 'Depression' },
  { id: 'stress', name: 'Stress Management' },
  { id: 'faith', name: 'Faith & Spirituality' },
  { id: 'crisis', name: 'Crisis Support' },
  { id: 'self-care', name: 'Self-Care' },
  { id: 'grief', name: 'Grief & Loss' }
]

const resourceTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'pdf', name: 'PDF Guides' },
  { id: 'audio', name: 'Audio Guides' },
  { id: 'worksheet', name: 'Worksheets' },
  { id: 'article', name: 'Articles' }
]

// Your actual resources with correct public paths
const ACTUAL_RESOURCES = [
  {
    id: 1,
    title: 'Understanding Anxiety Disorders',
    description: 'A comprehensive guide to understanding different types of anxiety disorders, their symptoms, and evidence-based treatment approaches.',
    category: 'anxiety',
    type: 'pdf',
    duration: '45 min read',
    level: 'Beginner',
    rating: 4.9,
    reviews: 156,
    featured: true,
    tags: ['Anxiety', 'Mental Health', 'Education', 'Guide'],
    filePath: '/Mental Health Resources/Understanding Anxiety Disorders.pdf',
    fileType: 'pdf'
  },
  {
    id: 2,
    title: 'Cognitive Behavioral Therapy (CBT) Basics',
    description: 'Learn to manage negative thought patterns using evidence-based CBT strategies. Includes exercises and worksheets.',
    category: 'depression',
    type: 'pdf',
    duration: '60 min read',
    level: 'Intermediate',
    rating: 4.8,
    reviews: 203,
    featured: true,
    tags: ['CBT', 'Therapy', 'Skills', 'Mental Health'],
    filePath: '/Mental Health Resources/Cognitive Behavioral Therapy Basics.pdf',
    fileType: 'pdf'
  },
  {
    id: 3,
    title: 'Daily Self-Care Checklist',
    description: 'Printable worksheet to track your daily self-care activities and build healthy habits.',
    category: 'self-care',
    type: 'worksheet',
    duration: '10 min daily',
    level: 'Beginner',
    rating: 4.7,
    reviews: 89,
    featured: false,
    tags: ['Self-Care', 'Worksheet', 'Habits'],
    filePath: '/Mental Health Resources/Daily Self-Care Checklist.pdf',
    fileType: 'pdf'
  },
  {
    id: 4,
    title: 'Finding Strength in Faith',
    description: 'Exploring how spiritual practices can support mental wellness and provide comfort during difficult times.',
    category: 'faith',
    type: 'pdf',
    duration: '30 min read',
    level: 'All Levels',
    rating: 4.9,
    reviews: 178,
    featured: true,
    tags: ['Faith', 'Spirituality', 'Hope'],
    filePath: '/Mental Health Resources/Finding Strength in Faith.pdf',
    fileType: 'pdf'
  },
  {
    id: 5,
    title: 'Crisis Coping Strategies',
    description: 'Immediate techniques and resources for managing mental health crises.',
    category: 'crisis',
    type: 'article',
    duration: '20 min read',
    level: 'All Levels',
    rating: 4.8,
    reviews: 112,
    featured: true,
    tags: ['Crisis', 'Emergency', 'Support'],
    filePath: '/Mental Health Resources/Crisis Coping Strategies/Crisis Coping Strategies.docx',
    fileType: 'document'
  },
  {
    id: 6,
    title: 'Mindfulness Meditation for Stress',
    description: 'Guided meditation audio to help reduce stress and anxiety.',
    category: 'stress',
    type: 'audio',
    duration: '25 min',
    level: 'All Levels',
    rating: 4.9,
    reviews: 234,
    featured: true,
    tags: ['Meditation', 'Mindfulness', 'Stress Relief', 'Audio'],
    audioUrl: '/Mental Health Resources/Mindfulness Meditation for Stress/Mindfulness Meditation for Stress.MP3',
    filePath: '/Mental Health Resources/Mindfulness Meditation for Stress/Mindfulness Meditation for Stress.MP3',
    fileType: 'audio'
  },
  {
    id: 7,
    title: 'Biblical Meditation Guide',
    description: 'A faith-based guide to meditation using scripture and prayer for mental wellness.',
    category: 'faith',
    type: 'pdf',
    duration: '40 min read',
    level: 'Intermediate',
    rating: 4.8,
    reviews: 67,
    featured: false,
    tags: ['Faith', 'Meditation', 'Bible'],
    filePath: '/Mental Health Resources/Faith Based Resources/Biblical Meditation Guide.pdf',
    fileType: 'pdf'
  },
  {
    id: 8,
    title: 'Psalms for the Heavy Heart',
    description: 'A collection of Psalms for comfort, hope, and healing during difficult times.',
    category: 'faith',
    type: 'pdf',
    duration: '35 min read',
    level: 'All Levels',
    rating: 4.9,
    reviews: 89,
    featured: false,
    tags: ['Faith', 'Psalms', 'Comfort'],
    filePath: '/Mental Health Resources/Faith Based Resources/Psalms for the Heavy Heart.pdf',
    fileType: 'pdf'
  },
  {
    id: 9,
    title: 'Strength in Weakness Devotional',
    description: 'A devotional guide finding strength in faith during challenging times.',
    category: 'faith',
    type: 'pdf',
    duration: '30 min read',
    level: 'All Levels',
    rating: 4.8,
    reviews: 56,
    featured: false,
    tags: ['Faith', 'Devotional', 'Strength'],
    filePath: '/Mental Health Resources/Faith Based Resources/Strength in Weakness Devotional.pdf',
    fileType: 'pdf'
  },
  {
    id: 10,
    title: '5 Minute Anxiety Reset',
    description: 'Quick anxiety relief techniques you can use anywhere.',
    category: 'anxiety',
    type: 'worksheet',
    duration: '5 min',
    level: 'Beginner',
    rating: 4.7,
    reviews: 145,
    featured: false,
    tags: ['Anxiety', 'Quick Relief', 'Exercise'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/5 Minute Anxiety Reset.pdf',
    fileType: 'pdf'
  },
  {
    id: 11,
    title: '5-Minute Calm Reset + When Anxiety Hits Guide',
    description: 'Guided audio exercise for immediate anxiety relief. Listen whenever you need to reset.',
    category: 'anxiety',
    type: 'audio',
    duration: '5 min',
    level: 'Beginner',
    rating: 4.8,
    reviews: 198,
    featured: true,
    tags: ['Anxiety', 'Audio', 'Quick Reset'],
    audioUrl: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/5-Minute Calm Reset + When Anxiety Hits Guide.mp3',
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/5-Minute Calm Reset + When Anxiety Hits Guide.mp3',
    fileType: 'audio'
  },
  {
    id: 12,
    title: 'Daily Well-Being Habits',
    description: 'Build sustainable mental health habits with this comprehensive wellbeing guide.',
    category: 'self-care',
    type: 'pdf',
    duration: '25 min read',
    level: 'Beginner',
    rating: 4.6,
    reviews: 78,
    featured: false,
    tags: ['Wellbeing', 'Habits', 'Self-Care'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Daily Well-Being Habits.pdf',
    fileType: 'pdf'
  },
  {
    id: 13,
    title: 'Grief & Loss Healing Guide',
    description: 'A compassionate guide to navigating grief, loss, and the healing journey.',
    category: 'grief',
    type: 'pdf',
    duration: '45 min read',
    level: 'Intermediate',
    rating: 4.9,
    reviews: 112,
    featured: true,
    tags: ['Grief', 'Loss', 'Healing'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Grief & Loss Healing.pdf',
    fileType: 'pdf'
  },
  {
    id: 14,
    title: '8-Week Healing Reading Plan',
    description: 'A structured 8-week journey through healing scriptures and mental wellness readings.',
    category: 'faith',
    type: 'pdf',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.9,
    reviews: 67,
    featured: false,
    tags: ['Faith', 'Healing', 'Reading Plan'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/8-Week Healing Reading Plan.pdf',
    fileType: 'pdf'
  },
  {
    id: 15,
    title: 'Tips for Meditation',
    description: 'Comprehensive guide to starting and maintaining a meditation practice.',
    category: 'stress',
    type: 'pdf',
    duration: '35 min read',
    level: 'Beginner',
    rating: 4.7,
    reviews: 123,
    featured: false,
    tags: ['Meditation', 'Mindfulness', 'Tips'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/Tips for Meditation.pdf',
    fileType: 'pdf'
  },
  {
    id: 16,
    title: 'Benefits of Yoga for Mental Health',
    description: 'Learn how yoga practice can reduce stress, anxiety, and improve overall wellbeing.',
    category: 'stress',
    type: 'pdf',
    duration: '25 min read',
    level: 'Beginner',
    rating: 4.6,
    reviews: 89,
    featured: false,
    tags: ['Yoga', 'Exercise', 'Stress Relief'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/Benefits of Yoga.pdf',
    fileType: 'pdf'
  },
  {
    id: 17,
    title: 'Grounding Exercise for Stress',
    description: 'A powerful grounding technique to bring you back to the present moment.',
    category: 'stress',
    type: 'worksheet',
    duration: '10 min',
    level: 'Beginner',
    rating: 4.8,
    reviews: 145,
    featured: false,
    tags: ['Grounding', 'Stress Relief', 'Exercise'],
    filePath: '/Mental Health Resources/MENTAL HEALTH RESOURCE PACK - Antoinette/Stress & Anxiety Toolkit/Grouding Exercise For Stress.pdf',
    fileType: 'pdf'
  }
]

export default function ResourceLibrary() {
  const [selectedResource, setSelectedResource] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [favorites, setFavorites] = useState(new Set())

  // Filter resources
  const getFilteredResources = () => {
    let filtered = [...ACTUAL_RESOURCES]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    return filtered
  }

  const filteredResources = getFilteredResources()
  const featuredResources = filteredResources.filter(r => r.featured)
  const regularResources = filteredResources.filter(r => !r.featured)

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

  const handleResourceView = (resource) => {
    setSelectedResource(resource)
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
          {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
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
      {featuredResources.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isFavorite={favorites.has(resource.id)}
                onFavorite={() => handleFavorite(resource.id)}
                onView={() => handleResourceView(resource)}
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
            {regularResources.length} resources found
          </span>
        </div>

        {regularResources.length === 0 && featuredResources.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedType('all')
              }}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isFavorite={favorites.has(resource.id)}
                onFavorite={() => handleFavorite(resource.id)}
                onView={() => handleResourceView(resource)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedResource && (
        <ResourceViewerModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}