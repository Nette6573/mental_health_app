import Logo from '@/components/shared/Logo'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
      <div className="text-center">
        <Logo size="large" className="justify-center mb-8" />
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Loading your HopePath experience...
        </p>
        
        {/* Progress Bar */}
        <div className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-primary-500 animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}