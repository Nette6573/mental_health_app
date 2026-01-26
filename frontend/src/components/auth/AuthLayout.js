'use client';
import Logo from '@/components/shared/Logo'

export default function AuthLayout({ 
  children, 
  title, 
  subtitle,
  background = 'default' 
}) {
  const backgroundStyles = {
    default: 'bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20',
    alternative: 'bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-900/10'
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${backgroundStyles[background]}`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Logo 
            size="large" 
            className="justify-center mb-6" 
            darkMode={false}
          />
          <h2 className="mt-2 text-3xl font-heading font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  )
}