'use client'

import { useState, useEffect } from 'react'

export default function BibleVerse({ verse, reference, translation = 'NIV', showActions = true, className = '' }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    // Check if verse is saved in localStorage
    const savedVerses = JSON.parse(localStorage.getItem('savedVerses') || '[]')
    setIsSaved(savedVerses.some(v => v.reference === reference))
  }, [reference])

  const handleSaveVerse = () => {
    const savedVerses = JSON.parse(localStorage.getItem('savedVerses') || '[]')
    
    if (isSaved) {
      // Remove from saved
      const updatedVerses = savedVerses.filter(v => v.reference !== reference)
      localStorage.setItem('savedVerses', JSON.stringify(updatedVerses))
    } else {
      // Add to saved
      const newVerse = { verse, reference, translation, date: new Date().toISOString() }
      localStorage.setItem('savedVerses', JSON.stringify([...savedVerses, newVerse]))
    }
    
    setIsSaved(!isSaved)
  }

  const handleCopyVerse = async () => {
    try {
      await navigator.clipboard.writeText(`"${verse}" - ${reference} (${translation})`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy verse:', err)
    }
  }

  const handleShareVerse = async () => {
    const shareText = `"${verse}" - ${reference} (${translation})`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: shareText,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copy
      handleCopyVerse()
    }
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <div className="flex-1">
          <blockquote className="text-lg text-gray-800 dark:text-gray-200 italic leading-relaxed mb-3">
            &quot;{verse}&quot;
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-medium">
                {reference}
              </p>
              <p className="text-blue-600 dark:text-blue-500 text-sm">
                {translation}
              </p>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveVerse}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save verse'}
                >
                  <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                
                <button
                  onClick={handleCopyVerse}
                  className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Copy verse"
                >
                  {isCopied ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleShareVerse}
                  className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Share verse"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for fetching random verse
export function useBibleVerse() {
  const [verse, setVerse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRandomVerse = async () => {
      try {
        setIsLoading(true)
        // This would typically call a Bible API
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const popularVerses = [
          {
            verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
            reference: "Philippians 4:6",
            translation: "NIV"
          },
          {
            verse: "I can do all this through him who gives me strength.",
            reference: "Philippians 4:13",
            translation: "NIV"
          },
          {
            verse: "The Lord is my shepherd, I lack nothing.",
            reference: "Psalm 23:1",
            translation: "NIV"
          },
          {
            verse: "Cast all your anxiety on him because he cares for you.",
            reference: "1 Peter 5:7",
            translation: "NIV"
          }
        ]
        
        const randomVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)]
        setVerse(randomVerse)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRandomVerse()
  }, [])

  return { verse, isLoading, error }
}