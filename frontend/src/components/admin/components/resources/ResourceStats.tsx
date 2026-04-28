'use client'

import {
  BookOpenIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'

interface ResourceStatsProps {
  resources: Array<{
    type: string
    status: string
    views: number
    likes: number
    shares: number
  }>
}

export default function ResourceStats({ resources }: ResourceStatsProps) {
  const stats = [
    {
      name: 'Total Resources',
      value: resources.length,
      icon: BookOpenIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Published',
      value: resources.filter(r => r.status === 'published').length,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Drafts',
      value: resources.filter(r => r.status === 'draft').length,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Views',
      value: resources.reduce((acc, r) => acc + r.views, 0).toLocaleString(),
      icon: EyeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Likes',
      value: resources.reduce((acc, r) => acc + r.likes, 0).toLocaleString(),
      icon: HeartIcon,
      color: 'bg-pink-500',
    },
    {
      name: 'Total Shares',
      value: resources.reduce((acc, r) => acc + r.shares, 0).toLocaleString(),
      icon: ShareIcon,
      color: 'bg-orange-500',
    },
  ]

  const typeCounts = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resource Type Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Resource Type Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">📄</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Articles</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {typeCounts['article'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">🎥</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Videos</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {typeCounts['video'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">🎵</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Audio</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {typeCounts['audio'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">🎙️</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Podcasts</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {typeCounts['podcast'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">📚</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Books</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {typeCounts['book'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">📖</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Guides</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {typeCounts['guide'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <span className="text-2xl mb-2 block">📝</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Worksheets</p>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {typeCounts['worksheet'] || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-2xl mb-2 block">🔗</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">External</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {typeCounts['external'] || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}