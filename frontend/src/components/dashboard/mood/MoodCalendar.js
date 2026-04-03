'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { getMood } from "@/services/moodService";

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'bg-red-500' },
  2: { emoji: '😔', label: 'Sad', color: 'bg-red-400' },
  3: { emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  4: { emoji: '🙂', label: 'Okay', color: 'bg-lime-400' },
  5: { emoji: '😊', label: 'Good', color: 'bg-green-400' },
  6: { emoji: '😄', label: 'Happy', color: 'bg-green-500' },
  7: { emoji: '🤩', label: 'Very Happy', color: 'bg-blue-500' },
  8: { emoji: '🥰', label: 'Loved', color: 'bg-purple-500' },
  9: { emoji: '😇', label: 'Blessed', color: 'bg-indigo-500' },
  10: { emoji: '🌈', label: 'Amazing', color: 'bg-pink-500' }
}

export default function MoodCalendar({ onDateSelect, refreshTrigger }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [moodEntries, setMoodEntries] = useState({})

  //  API call
  useEffect(() => {
  const fetchMoodData = async () => {
    const uid = localStorage.getItem("uid");

    if (!uid) return;

    const data = await getMood(uid);

    const formatted = {};

    data.mood_log.forEach(entry => {
      const date = new Date(entry.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      formatted[key] = entry;
    });

    setMoodEntries(formatted);
  };

  fetchMoodData();
}, [currentDate, refreshTrigger]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getMoodForDate = (date) => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    return moodEntries[key]
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood Calendar
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-900 dark:text-white min-w-48 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const moodEntry = date ? getMoodForDate(date) : null
          const isToday = date && date.toDateString() === new Date().toDateString()
          
          return (
            <button
              key={index}
              onClick={() => date && onDateSelect(date)}
              disabled={!date}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all duration-200
                ${!date ? 'invisible' : ''}
                ${isToday ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent'}
                ${moodEntry ? 'hover:scale-105 hover:shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                flex flex-col items-center justify-center relative
              `}
            >
              {date && (
                <>
                  <span className={`
                    text-sm font-medium mb-1
                    ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}
                  `}>
                    {date.getDate()}
                  </span>
                  
                  {moodEntry ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg" title={moodEmojis[moodEntry.mood].label}>
                        {moodEmojis[moodEntry.mood].emoji}
                      </span>
                      <div className={`w-2 h-2 rounded-full mt-1 ${moodEmojis[moodEntry.mood].color}`}></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">+</span>
                    </div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Mood Scale</h4>
        <div className="flex flex-wrap gap-2">
          {[1, 3, 5, 7, 9].map(level => (
            <div key={level} className="flex items-center space-x-2">
              <span className="text-lg">{moodEmojis[level].emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{moodEmojis[level].label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}