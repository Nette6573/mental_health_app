'use client'

import { useState, useEffect } from 'react'
import ResourceCard from './ResourceCard'
import SearchBar from './SearchBar'
import ResourceFilter from './ResourceFilter'
import ResourceViewerModal from './ResourceViewerModal'

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

const handleResourceClick = async () => {
  const uid = localStorage.getItem("uid")

  await fetch(`http://127.0.0.1:8000/api/use-resource/${uid}`, {
    method: "POST"
  })
}

export default function ResourceLibrary() {
  const [selectedResource, setSelectedResource] = useState(null)
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
          tags: ['Anxiety', 'Mental Health', 'Education'],
          content: {
            intro:
              'Anxiety disorders are among the most common mental health conditions. While occasional anxiety is a normal part of life, persistent or overwhelming anxiety can affect relationships, work, school, and daily functioning.',
            sections: [
              {
                heading: 'What anxiety can look like',
                paragraphs: [
                  'Anxiety does not always look the same for everyone. Some people experience constant worry, while others feel panic, restlessness, racing thoughts, or physical symptoms such as sweating, trembling, chest tightness, or nausea.',
                  'It may come in waves or stay present in the background throughout the day.'
                ],
              },
              {
                heading: 'Common signs and symptoms',
                bullets: [
                  'Excessive worry that feels hard to control',
                  'Feeling restless, tense, or on edge',
                  'Trouble concentrating or feeling mentally overwhelmed',
                  'Sleep difficulties',
                  'Rapid heartbeat, shortness of breath, or stomach discomfort',
                  'Avoiding situations that trigger fear or stress'
                ],
              },
              {
                heading: 'Helpful treatment approaches',
                paragraphs: [
                  'Many people benefit from a combination of support strategies. These may include therapy, stress management techniques, breathing exercises, journaling, sleep improvement, physical activity, and professional guidance.',
                  'Cognitive Behavioral Therapy (CBT) is one evidence-based approach often used to help people challenge anxious thoughts and build healthier coping patterns.'
                ],
              },
              {
                heading: 'When to seek support',
                paragraphs: [
                  'If anxiety is interfering with your daily life, relationships, sleep, or ability to function, it may be time to speak with a licensed mental health professional.',
                  'Seeking help is not weakness. Early support can make symptoms easier to manage and improve quality of life.'
                ],
              },
            ],
          },
        },
        {
          id: 2,
          title: 'Mindfulness Meditation for Stress',
          description: 'Guided meditation sessions designed to help reduce stress and promote mindfulness in daily life.',
          category: 'stress',
          type: 'audio',
          duration: '20 min',
          level: 'All Levels',
          rating: 4.9,
          reviews: 89,
          featured: true,
          tags: ['Meditation', 'Mindfulness', 'Stress Relief'],

         fileUrl: 'https://drive.google.com/file/d/13qYCtqJ6mr7y0HLspH-_J1mRsOV95PdC/preview',
          //audioUrl: '/audio/mindfulness.mp3', // 👈 IMPORTANT

          content: {
            intro:
              'This guided meditation helps you slow down, focus your breathing, and release tension from your body and mind.',
          },
        },
        {
          id: 3,
          title: 'Cognitive Behavioral Therapy (CBT) Basics',
          description:
            'A 6-module self-paced course to help you understand and manage negative thought patterns using evidence-based CBT strategies.',
          category: 'depression',
          type: 'course',
          duration: '6 modules',
          level: 'Intermediate',
          image: '/images/resources/cbt-course.jpg',
          rating: 4.7,
          reviews: 203,
          featured: false,
          tags: ['CBT', 'Therapy', 'Skills'],

          fileUrl: 'https://docs.google.com/document/d/1Pa3TXQdlocnYU2sao5D6BrcKwsxoboSuRUZVCnNS2jM/preview',

          content: {
            intro:
              'Cognitive Behavioral Therapy (CBT) is a structured, evidence-based approach that helps individuals understand how thoughts, emotions, and behaviors are connected. This course walks you through core CBT skills you can apply in daily life to manage anxiety and negative thinking patterns.',

            sections: [
              {
                heading: 'Important Note',
                paragraphs: [
                  'This course is for educational purposes only and does not replace professional therapy. If anxiety significantly interferes with your daily functioning or includes panic attacks, trauma symptoms, or suicidal thoughts, please consult a licensed mental health professional.',
                ],
              },

              {
                heading: 'Module 1: What Is CBT?',
                bullets: [
                  'Understand the difference between fear and anxiety',
                  'Learn how CBT works',
                  'Recognize the “vicious cycle” of anxiety',
                ],
                paragraphs: [
                  'Fear is a natural emotion that protects us from danger. Anxiety occurs when we experience fear even when no immediate danger is present.',
                  'CBT combines cognitive therapy (working with thoughts) and behavior therapy (working with actions) to reduce anxiety symptoms.',
                ],
              },

              {
                heading: 'Module 2: Thought Distortions',
                bullets: [
                  'Catastrophizing',
                  'Mind reading',
                  'Overgeneralization',
                  'All-or-nothing thinking',
                  'Emotional reasoning',
                ],
                paragraphs: [
                  'CBT teaches that thoughts influence feelings, which influence behavior. Many anxious thoughts are exaggerated or inaccurate.',
                ],
              },

              {
                heading: 'Module 3: Thought Records & Restructuring',
                bullets: [
                  'Identify automatic thoughts',
                  'Examine evidence for and against',
                  'Create balanced thoughts',
                ],
                paragraphs: [
                  'This module teaches how to challenge anxious thoughts and replace them with more realistic and balanced thinking.',
                ],
              },

              {
                heading: 'Module 4: Behavioral Activation',
                bullets: [
                  'Understand avoidance patterns',
                  'Break tasks into smaller steps',
                  'Gradually re-engage with avoided situations',
                ],
                paragraphs: [
                  'Avoidance reduces anxiety short-term but increases it long-term. CBT helps you take small steps toward action.',
                ],
              },

              {
                heading: 'Module 5: Exposure Basics',
                bullets: [
                  'Gradually face fears',
                  'Build tolerance to anxiety',
                  'Create an exposure ladder',
                ],
                paragraphs: [
                  'Exposure helps your brain learn that feared situations are manageable and not as dangerous as expected.',
                ],
              },

              {
                heading: 'Module 6: Daily CBT Plan',
                bullets: [
                  'Morning: identify stressors',
                  'Daytime: notice distortions',
                  'Evening: reflect and journal',
                ],
                paragraphs: [
                  'CBT becomes most effective when practiced consistently as part of your daily routine.',
                ],
              },
            ],
          },
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
          tags: ['Self-Care', 'Worksheet', 'Habits'],
          fileUrl: 'https://drive.google.com/file/d/1ad3ySBuZXeHMMEbF63G26RzW4yES05mY/preview'
          //pdfUrl: '/worksheets/daily-self-care-checklist.pdf'
        },
        {
          id: 5,
          title: 'Finding Strength in Faith',
          description:
            'Exploring how spiritual practices can support mental wellness and provide comfort during difficult times.',
          category: 'faith',
          type: 'article',
          duration: '12 min read',
          level: 'All Levels',
          image: '/images/resources/faith-strength.jpg',
          rating: 4.9,
          reviews: 156,
          featured: true,
          tags: ['Faith', 'Spirituality', 'Hope'],

          fileUrl: "https://drive.google.com/file/d/13qYCtqJ6mr7y0HLspH-_J1mRsOV95PdC/preview",

          content: {
            intro:
              'Spirituality and faith have been central sources of comfort and resilience for people around the world for centuries. Whether through prayer, meditation, communal worship, or meaning‐making frameworks, spiritual practices can help individuals cope with stress, reduce anxiety, and find hope in challenging moments. Today, scientific research increasingly confirms that spirituality isn’t just a matter of belief — it can also play a meaningful role in mental well‐being and emotional health when integrated thoughtfully into a person’s life.',
            sections: [
              {
                heading: 'Introduction',
                paragraphs: [
                  'In this article, we’ll explore how spiritual practices support mental wellness, how they can be woven into daily life, and practical steps you can take — all while drawing on both research and real‐life experience in a culturally sensitive way, including Jamaican examples where appropriate.'
                ]
              },
              {
                heading: 'What Does “Spirituality” Mean in Mental Wellness?',
                paragraphs: [
                  'At its core, spirituality involves seeking meaning, purpose, connection, and transcendence — a sense of being part of something larger than oneself. It can be rooted in organized religion, personal belief systems, or even secular spiritual practices. Spirituality differs from simply following routines; it touches on deep values and emotional experiences that shape how people interpret life events.',
                  'Research shows that religious and spiritual engagement is positively associated with life satisfaction, meaning in life, and improved social relationships, while often correlating with lower levels of anxiety and depressive symptoms.',
                  'Faith, therefore, can act as both a cognitive resource (meaning‐making and interpretation) and an emotional anchor (providing hope, comfort, and community).'
                ]
              },
              {
                heading: 'How Faith and Spiritual Practices Benefit Mental Health',
                image: 'https://pixabay.com/get/g8cb06f51579d40bacd2b80768b13bc24b6133cd6ef59bcfb42f6029db11c56884b08ab12da1289477d70f9106916807f2d754316193fa5368239d1ffb67ba3ad_1280.jpg',
                imageAlt: 'Meditation and relaxation illustration',
                paragraphs: [
                  'Spiritual and faith‐based practices support mental wellness in several scientifically documented ways:'
                ]
              },
              {
                heading: '🧠 1. Meaning and Purpose in Hard Times',
                paragraphs: [
                  'Many people use faith to interpret life stressors through a lens of meaning — seeing challenges as part of a larger story rather than random misfortune. This process is known to reduce distress and improve emotional resilience because it helps individuals make sense of adversity rather than feel overwhelmed by it.',
                  'In Jamaican life, for example, a family member might draw strength from believing that difficulties have spiritual significance (“Mi going through dis but God nah lef mi”), which can provide a sense of purpose and lessen feelings of hopelessness.'
                ]
              },
              {
                heading: '❤️ 2. Community and Social Support',
                paragraphs: [
                  'Spiritual communities — whether church groups, prayer circles, or fellowship gatherings — provide powerful social support, which is a protective factor against anxiety, depression, and isolation. Being part of a community reinforces a sense of belonging and shared experience, reminding individuals they are not alone.',
                  'In Jamaica, community support often comes through weekly church services, choir groups, or small group gatherings that blend social connection with spiritual support.'
                ]
              },
              {
                heading: '3. Practices That Calm the Mind',
                paragraphs: [
                  'Certain spiritual practices mirror psychological techniques like mindfulness and meditation, which have been well researched for their mental health benefits. These include:',
                  'Studies suggest that meditation and reflective practices can reduce stress hormones like cortisol, support emotional regulation, and enhance psychological well‐being.',
                  'Jamaican examples could include quiet reflection with Reggae gospel, singing praise songs at home, or journaling spiritual gratitude each morning without distraction.'
                ],
                bullets: [
                  'Prayer and contemplative reflection',
                  'Breath‐focused meditation',
                  'Loving‐kindness or compassionate prayer',
                  'Singing ancestral hymns or spiritual music'
                ]
              },
              {
                heading: '🌟 4. Hope and Coping with Loss',
                paragraphs: [
                  'Faith can offer tools to cope with grief, loss, or major life transitions. Beliefs about divine purpose or the afterlife, as well as ritual practices such as prayer or reading scripture, can provide profound comfort and emotional processing. This helps individuals move through grief rather than feeling stuck in overwhelming sorrow.'
                ]
              },
              {
                heading: 'Research Behind Spiritual Coping',
                paragraphs: [
                  'A body of scientific research supports these mental health benefits:',
                  'Together, these findings suggest that faith and spirituality are more than subjective feelings — they have real psychological effects that help people manage distress and build resilience.'
                ],
                bullets: [
                  'A large systematic analysis of nearly 79,000 participants found that rich religious/spiritual life was negatively associated with anxiety and depression and positively associated with life satisfaction and overall well‐being.',
                  'Qualitative research among aid workers in stressful environments found that faith and spirituality were important psychological coping mechanisms linked to reduced distress and better psychological adjustment.',
                  'Scientific reviews also highlight that prayer, meditation, and ritual participation frequently align with reductions in stress and give individuals a sense of belonging and identity.'
                ]
              },
              {
                heading: 'Practical Spiritual Practices for Mental Wellness',
                paragraphs: [
                  'Below are some spiritual practices that many people — including Jamaicans — find uplifting and beneficial for mental health. You can adapt these to your personal beliefs and lifestyle:'
                ]
              },
              {
                heading: '✨ 1. Daily Reflection or Prayer',
                image: 'https://pixabay.com/photos/praying-bible-reading-bible-worship-5406270/',
                imageAlt: 'Person praying and reading the Bible',
                paragraphs: [
                  'Set aside 5–10 minutes to focus your thoughts, express gratitude, or pray for strength.',
                  'Use this time to acknowledge feelings without judgment.',
                  'Example practice:',
                  '“Today, I give thanks for three blessings: good health, family, and peace of mind.”'
                ]
              },
              {
                heading: '🌿 2. Scripture or Inspirational Reading',
                paragraphs: [
                  'Reading meaningful passages can nourish the soul and provide perspective.',
                  'Consider texts that emphasize peace, resilience, or purpose.',
                  'Example Jamaican context:',
                  'Many Jamaicans find comfort in passages like Psalm 23 or Philippians 4:6‐7, which encourage peace in anxious times.'
                ]
              },
              {
                heading: '🎵 3. Spiritual Music or Hymns',
                paragraphs: [
                  'Listening to spiritual or religious music can be calming and emotionally grounding. In Jamaica, gospel reggae or church choir music can be especially comforting, offering both melody and meaning.'
                ]
              },
              {
                heading: '🤲 4. Gratitude Journaling',
                paragraphs: [
                  'Write down things you’re grateful for each day — spiritual or secular. This simple practice strengthens awareness of blessings and shifts focus away from worry.'
                ]
              },
              {
                heading: '5. Meditative Prayer or Contemplation',
                paragraphs: [
                  'Even if not formally religious, contemplative prayer (quiet, focused reflection on inner experience and values) can reduce stress and sharpen emotional clarity. Concepts from mindfulness meditation overlap with this practice and benefit mental well‐being.'
                ]
              },
              {
                heading: 'Spiritual Wellness and Connection',
                paragraphs: [
                  'Spiritual practices often work through connection — connection with self, with others, with a transcendent reality, or with community. Research shows that when people feel connected and supported, the emotional brain responds with greater resilience and less fear reactivity.',
                  'Even outside formal religion, spiritual values like compassion, forgiveness, and service contribute to healthier emotional regulation and deeper purpose.'
                ]
              },
              {
                heading: 'How to Begin Your Spiritual Wellness Routine',
                paragraphs: [
                  'You don’t need to overhaul your life. Start small:',
                  'Make the practice your own — what matters most is consistency, not perfection.'
                ],
                bullets: [
                  'Set a daily moment of quiet (5–10 mins)',
                  'Practice gratitude',
                  'Participate in community worship if you desire',
                  'Use music or scripture for comfort',
                  'Reflect on meaning and purpose'
                ]
              },
              {
                heading: 'Things to Remember',
                bullets: [
                  'Spiritual practices can complement mental health support, not replace professional help.',
                  'If you’re struggling with severe anxiety, depression, or distress, seek support from a mental health professional alongside spiritual practices.'
                ]
              },
              {
                heading: '🌟 Everyday Spiritual Exercise',
                paragraphs: [
                  'Try this 10‐minute grounding exercise:',
                  'Notice how your body feels before and after — even small routines can build stability and hope.'
                ],
                bullets: [
                  'Sit in a quiet, comfortable place',
                  'Take five slow breaths, focusing on calm',
                  'Reflect on something you’re grateful for',
                  'Offer a silent prayer or intention for peace',
                  'Think of one way you will show kindness today'
                ]
              },
              {
                heading: '🧠 Sources & Further Reading',
                bullets: [
                  'Coelho‐Júnior, H. J., et al. (2022). Spirituality and mental health associations. Systematic review.',
                  'Ozcan, O., Hoelterhoff, M., & Wylie, E. (2021). Faith and spirituality as coping.',
                  '“Spirituality and Mental Health.” McLean Hospital.',
                  '“10 Ways Faith Can Support Mental Health.” Mental Health America.',
                  'Comprehensive review of religious practices on well‐being.'
                ]
              }
            ]
          }
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
        tags: ['Crisis', 'Emergency', 'Support'],

        fileUrl: 'https://www.youtube.com/embed/5EXpkVw3fh0'
        /*embedUrls: [
          'https://www.youtube.com/embed/5-PgSUTOSeM',
          'https://www.youtube.com/embed/fKyapN8B3Mw' // add more here
        ]*/
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

  const handleResourceView = async (resource) => {
  const uid = localStorage.getItem("uid")

  // track usage
  await fetch(`http://127.0.0.1:8000/api/use-resource/${uid}`, {
    method: "POST"
  })

  // keep existing behavior
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
                onView={() => handleResourceView(resource)}
              />
            ))}
          </div>
        )}
      </div>
      <ResourceViewerModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  )
}