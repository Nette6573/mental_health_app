'use client'

import dynamic from 'next/dynamic'

const GeographicMap = dynamic(() => import('./GeographicMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
      </div>
      <div className="p-6">
        <div className="h-[500px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    </div>
  ),
})

export default GeographicMap