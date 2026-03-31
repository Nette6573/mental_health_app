'use client'

import { useState, useEffect } from 'react'
import ResourceCard from './ResourceCard'
import ResourceViewerModal from './ResourceViewerModal'

const faithCategories = [
  { id: 'all', name: 'All Resources' },
  { id: 'devotionals', name: 'Daily Devotionals' },
  { id: 'prayer', name: 'Prayer Guides' },
  { id: 'scripture', name: 'Scripture Studies' },
  { id: 'testimonies', name: 'Testimonies' },
  { id: 'worship', name: 'Worship & Music' }
]

export default function FaithResources() {
  const [selectedResource, setSelectedResource] = useState(null)
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
          description:
            "A 7-day devotional exploring how God's strength is made perfect in our weakness, with practical applications for mental health struggles.",
          category: 'devotionals',
          type: 'article',
          duration: '7 days',
          level: 'All Levels',
          image: '/images/faith/strength-devotional.jpg',
          rating: 4.9,
          reviews: 234,
          featured: true,
          tags: ['Devotional', 'Strength', 'Hope', '2 Corinthians 12:9'],

          content: {
            intro:
              "In a world that often celebrates strength and self-sufficiency, acknowledging our weaknesses can feel counterintuitive, especially when facing mental health struggles. Yet, scripture reveals a deeper truth: it is often in our moments of greatest weakness that God's strength is most clearly displayed. This 7-day devotional explores how God uses our vulnerabilities to demonstrate His power, love, and grace. :contentReference[oaicite:0]{index=0}",

            sections: [
              {
                heading: 'Day 1: Understanding God’s Perspective on Weakness',
                paragraphs: [
                  "Scripture: 2 Corinthians 12:9-10",
                  "God’s grace is not dependent on our strength. In moments of anxiety, depression, or burnout, what feels like weakness may actually be the very place where God’s power is revealed.",
                ],
                bullets: [
                  'Acknowledge your struggles honestly',
                  'Stop viewing weakness as failure',
                  'Receive God’s grace without conditions'
                ]
              },

              {
                heading: 'Day 2: Finding Strength in Vulnerability',
                paragraphs: [
                  "Scripture: Psalm 34:18",
                  "God draws near to the brokenhearted. Vulnerability is not failure — it is an invitation for God to meet you deeply.",
                ],
                bullets: [
                  'Practice honest prayer',
                  'Be open with safe people',
                  'Seek professional support if needed'
                ]
              },

              {
                heading: 'Day 3: The Power of Hope',
                paragraphs: [
                  "Scripture: Romans 15:13",
                  "Hope is not based on your situation — it is rooted in God’s character. Even when things feel dark, hope can still exist.",
                ],
                bullets: [
                  'Focus on God’s promises',
                  'Practice gratitude daily',
                  'Engage in uplifting spiritual habits'
                ]
              },

              {
                heading: 'Day 4: Releasing Control',
                paragraphs: [
                  "Scripture: Proverbs 3:5-6",
                  "Anxiety often comes from trying to control everything. God invites you to trust Him instead.",
                ],
                bullets: [
                  'Identify what you are trying to control',
                  'Practice surrender through prayer',
                  'Focus on the present moment'
                ]
              },

              {
                heading: 'Day 5: Receiving God’s Comfort',
                paragraphs: [
                  "Scripture: Psalm 23:4",
                  "Even in your darkest moments, you are not alone. God’s presence brings comfort and guidance.",
                ],
                bullets: [
                  'Keep comforting scriptures nearby',
                  'Spend quiet time in God’s presence',
                  'Surround yourself with reminders of faith'
                ]
              },

              {
                heading: 'Day 6: Body, Mind, and Spirit',
                paragraphs: [
                  "Scripture: 1 Corinthians 6:19-20",
                  "Your well-being matters. Taking care of your body and mind is part of honoring God.",
                ],
                bullets: [
                  'Prioritize sleep, food, and exercise',
                  'Practice mental self-care',
                  'Seek holistic support when needed'
                ]
              },

              {
                heading: 'Day 7: Continuing the Journey',
                paragraphs: [
                  "Scripture: Philippians 4:6-7",
                  "Healing is a process. God’s peace can guard your heart even while you are still growing.",
                ],
                bullets: [
                  'Maintain a daily prayer rhythm',
                  'Practice thanksgiving',
                  'Be patient with yourself',
                  'Stay connected to support systems'
                ]
              },

              {
                heading: 'Conclusion',
                paragraphs: [
                  "Your weaknesses are not something to hide — they are where God’s strength can shine the most. As you continue this journey, remember: you are not alone, and your story is still unfolding. In Christ, even your weakest moments can become sources of strength."
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Prayers for Anxiety and Peace',
          description: "Guided prayers and scripture meditations specifically designed for moments of anxiety and seeking God's peace.",
          category: 'prayer',
          type: 'video',
          duration: 'Playlist',
          level: 'Beginner',
          image: '/images/faith/prayer-guide.jpg',
          rating: 4.8,
          reviews: 167,
          featured: true,
          tags: ['Prayer', 'Anxiety', 'Peace', 'Philippians 4:6-7'],

          embedUrls: [
            'https://www.youtube.com/embed/videoseries?list=PLYNaBRH_3BOHU9O1u-jRvUulths7JfET3'
          ]
        },
        {
          id: 3,
          title: 'Psalms for the Heavy Heart',
          description:
            'A 5-module interactive course for finding light in the shadows through lament, hope, and God’s presence in the Psalms.',
          category: 'scripture',
          type: 'course',
          duration: '5 modules',
          level: 'Intermediate',
          image: '/images/faith/psalms-study.jpg',
          rating: 4.7,
          reviews: 89,
          featured: false,
          tags: ['Psalms', 'Depression', 'Comfort', 'Scripture Study'],

          content: {
            intro:
              'Welcome to a deep dive into the Prayer Book of the Bible. If you feel like you are walking through a dark fog, you are in good company. The Psalms were written by real people—kings, fugitives, and poets—who wrestled with sorrow, abandonment, and exhaustion.',

            sections: [
              {
                heading: 'Module 1: The Permission to Lament',
                image: 'https://images.pexels.com/photos/36211995/pexels-photo-36211995.jpeg?_gl=1*ky30wk*_ga*MTYzNDM4MjQ3MS4xNzc0MTMyODE5*_ga_8JE65Q40S6*czE3NzQxMzI4MTgkbzEkZzEkdDE3NzQxMzI4MzEkajQ3JGwwJGgw',
                imageAlt: 'Lament and prayer imagery',
                paragraphs: [
                  'Core Theme: God doesn’t want a polite version of you; He wants the real you.',
                  'In this module, we look at Psalm 13. David starts with a blunt question: “How long, Lord? Will you forget me forever?”',
                  'The Deep Dive: We explore the anatomy of a lament. It’s not just complaining; it’s complaining to the only One who can fix it.',
                  'Mental Health Connection: Validating your emotions is the first step toward processing them. Repression leads to explosion; lament leads to release.'
                ],
                bullets: [
                  'Interactive Element: The “Lament Lab”',
                  'Use the template: How long, Lord, until [Your Struggle]?',
                  'But I trust in [A Character of God].'
                ]
              },
              {
                heading: 'Module 2: When the Waves Overwhelm',
                image: 'https://images.pexels.com/photos/6028522/pexels-photo-6028522.jpeg?_gl=1*15aawtu*_ga*MTYzNDM4MjQ3MS4xNzc0MTMyODE5*_ga_8JE65Q40S6*czE3NzQxMzI4MTgkbzEkZzEkdDE3NzQxMzI5MTckajMwJGwwJGgw',
                imageAlt: 'Waves and emotional overwhelm',
                paragraphs: [
                  'Core Theme: Spiritual depression and the “Why?” of the soul.',
                  'We dive into Psalm 42 & 43. The writer says, “My tears have been my food day and night.” This isn’t just a bad day; it’s a soul-crushing season.',
                  'The Deep Dive: Notice the self-talk in verse 5: “Why, my soul, are you downcast?” The Psalmist stops listening to his depressed heart and starts preaching to it.',
                  'Practical Application: Learning to distinguish between your feelings and facts.'
                ],
                bullets: [
                  'Interactive Challenge: The “Pulse Check” Quiz',
                  'On a scale of 1–10, how loud is your downcast soul today?',
                  'What is one truth you can whisper back to it?'
                ]
              },
              {
                heading: 'Module 3: The Darkest Night (Psalm 88)',
                image: 'https://images.pexels.com/photos/1662367/pexels-photo-1662367.jpeg?_gl=1*7omqzv*_ga*MTYzNDM4MjQ3MS4xNzc0MTMyODE5*_ga_8JE65Q40S6*czE3NzQxMzI4MTgkbzEkZzEkdDE3NzQxMzI5ODgkajE5JGwwJGgw',
                imageAlt: 'Dark night and quiet reflection',
                paragraphs: [
                  'Core Theme: When the clouds don’t lift—and that’s okay.',
                  'Most Psalms end with a hallelujah. Psalm 88 does not. It ends with the words: “Darkness is my closest friend.”',
                  'The Deep Dive: Why is this in the Bible? Because God wants you to know that He hears you even when there is no immediate happy ending. He is present in the silence.',
                  'Mental Health Connection: Combating the toxic positivity sometimes found in religious circles. It is okay to not be okay.'
                ],
                bullets: [
                  'Interactive Reflection: The Prayer Wall',
                  'Write down a prayer that does not have an answer yet.',
                  'Sit with the silence, knowing Christ sat in the darkness of the tomb for you.'
                ]
              },
              {
                heading: 'Module 4: The Shepherd in the Shadows',
                image: 'https://images.pexels.com/photos/36638471/pexels-photo-36638471.jpeg?_gl=1*190aakh*_ga*MTYzNDM4MjQ3MS4xNzc0MTMyODE5*_ga_8JE65Q40S6*czE3NzQxMzI4MTgkbzEkZzEkdDE3NzQxMzMwNDAkajQyJGwwJGgw',
                imageAlt: 'Shepherd in a valley',
                paragraphs: [
                  'Core Theme: Protection and presence in the Valley of the Shadow of Death.',
                  'We revisit Psalm 23.',
                  'The Deep Dive: Focus on the shift in pronouns. In the green pastures, David talks about God (“He leads me”). In the valley, he talks to God (“You are with me”). The valley turns information into intimacy.',
                  'Practical Application: Grounding techniques using the rod and staff—Scripture and community.'
                ],
                bullets: [
                  'Interactive Game: “Valley Vocabulary” Kahoot!',
                  'Sample question: In Psalm 23, what does the table in the presence of enemies represent?',
                  'Answer: God’s provision and safety amidst the battle.'
                ]
              },
              {
                heading: 'Module 5: The Dawn of Deliverance',
                image: 'https://images.pexels.com/photos/6961245/pexels-photo-6961245.jpeg?_gl=1*1qel4oo*_ga*MTYzNDM4MjQ3MS4xNzc0MTMyODE5*_ga_8JE65Q40S6*czE3NzQxMzI4MTgkbzEkZzEkdDE3NzQxMzMwNjYkajE2JGwwJGgw',
                imageAlt: 'Dawn and hope after darkness',
                paragraphs: [
                  'Core Theme: Joy comes in the morning, even if the morning takes a while.',
                  'We conclude with Psalm 30 and Psalm 126: “Those who sow with tears will reap with songs of joy.”',
                  'The Deep Dive: Reaping joy is a harvest—it takes time, soil, and rain.',
                  'Practical Application: Build a Stone of Help list. What are the small ways God has sustained you this week?'
                ],
                bullets: [
                  'Final Course Project: Create Your Own Psalm',
                  'Using the themes of the last 5 modules, write a 4-line poem or prayer about your journey from shadow toward light.'
                ]
              },
              {
                heading: 'Final Assessment: The Heart-Check Quiz',
                paragraphs: [
                  'Test your knowledge on the authors of the Psalms, the types of lament, and the promises of God’s presence found in the text.'
                ],
                bullets: [
                  <p key="kahoot-link">
                    Interactive Link: 
                      <a href="https://create.kahoot.it/share/the-psalms-for-the-heavy-heart-quiz/e3d12b01-a71f-464b-aee1-12bfa4b6fedc" target="_blank" rel="noopener noreferrer" color='blue'><u> Click here to launch the Kahoot! Challenge</u></a>
                  </p>
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'From Broken to Beautiful',
          description:
            'Powerful testimonies of individuals who found healing and purpose through their faith journey with mental health challenges.',
          category: 'testimonies',
          type: 'video',
          duration: '9 videos',
          level: 'All Levels',
          image: '/images/faith/testimonies.jpg',
          rating: 5.0,
          reviews: 56,
          featured: false,
          tags: ['Testimony', 'Healing', 'Hope', 'Inspiration'],

          embedUrls: [
            'https://www.youtube.com/embed/HefMjGE7s40',
            'https://www.youtube.com/embed/v1yn-jdTJGU',
            'https://www.youtube.com/embed/WpwOGaT9Rws',
            'https://www.youtube.com/embed/BmyP9-74TIc',
            'https://www.youtube.com/embed/YolE0pVVByA',
            'https://www.youtube.com/embed/pQ3_GI2H0wY',
            'https://www.youtube.com/embed/DD7GMVWjwq4',
            'https://www.youtube.com/embed/3sQzRwNyQ1s',
            'https://www.youtube.com/embed/wv0Dj0mMbtg'
          ]
        },
      {
        id: 5,
        title: 'Worship for the Weary Soul',
        description:
          'A calming worship experience to help restore peace, reduce stress, and reconnect with God.',
        category: 'worship',
        type: 'video',
        duration: '1 video',
        level: 'All Levels',
        image: '/images/faith/worship.jpg',
        rating: 4.9,
        reviews: 112,
        featured: false,
        tags: ['Worship', 'Music', 'Peace', 'Healing'],

        embedUrls: [
          'https://www.youtube.com/embed/y7OdZ-L7mqY'
        ]
      },
       {
        id: 6,
        title: 'Biblical Meditation Guide',
        description:
          'A practical guide to biblical meditation, helping you reflect on scripture, renew your mind, and deepen your spiritual focus.',
        category: 'scripture',
        type: 'worksheet',
        duration: 'PDF Guide',
        level: 'Beginner',
        image: '/images/faith/meditation-guide.jpg',
        rating: 4.8,
        reviews: 74,
        featured: false,
        tags: ['Meditation', 'Scripture', 'Mindfulness'],

        pdfUrl: '/worksheets/bmg.pdf'
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
                  onView={() => setSelectedResource(resource)}
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
                onView={() => setSelectedResource(resource)}
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
      <ResourceViewerModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  )
}