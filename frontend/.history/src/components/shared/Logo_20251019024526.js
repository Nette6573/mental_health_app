import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ 
  darkMode = false, 
  className = '',
  showText = true,
  size = 'default',
  link = '/',
  variant = 'default' // 'default', 'symbol', 'full'
}) {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-8 h-8',
      text: 'text-lg',
      imageSize: 50,
      spacing: 'space-x-2'
    },
    default: {
      container: 'w-10 h-10',
      text: 'text-xl',
      imageSize: 40,
      spacing: 'space-x-2'
    },
    large: {
      container: 'w-12 h-12',
      text: 'text-2xl',
      imageSize: 48,
      spacing: 'space-x-3'
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-3xl',
      imageSize: 64,
      spacing: 'space-x-3'
    }
  }

  const { container, text, imageSize, spacing } = sizeConfig[size]

  // Logo variations
  const logoVariants = {
    default: {
      showSymbol: true,
      showText: showText,
      text: 'HopePath'
    },
    symbol: {
      showSymbol: true,
      showText: false,
      text: ''
    },
    full: {
      showSymbol: true,
      showText: showText,
      text: 'HopePath - Mental Health Support'
    }
  }

  const { showSymbol, showText: showTextLabel, text: logoText } = logoVariants[variant]

  return (
    <Link 
      href={link} 
      className={`flex items-center ${spacing} ${className} group`}
      aria-label="HopePath - Home"
    >
      {/* Logo Symbol */}
      {showSymbol && (
        <div className={`relative ${container} rounded-full bg-primary-500 flex items-center justify-center overflow-hidden group-hover:bg-primary-600 transition-all duration-300 transform group-hover:scale-105`}>
          {/* Fallback SVG if image doesn't load */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-1/2 w-1/2 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          {/* Next.js Image */}
          <Image
            src="/images/hopepath.png"
            alt="HopePath Logo"
            width={imageSize}
            height={imageSize}
            className="object-contain relative z-10"
            priority
            onError={(e) => {
              // Hide the image if it fails to load, showing the SVG fallback
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      {/* Logo Text */}
      {showTextLabel && (
        <div className="flex flex-col">
          <span className={`font-heading ${text} font-bold ${darkMode ? 'text-white' : 'text-primary-700 dark:text-primary-400'} group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300 leading-tight`}>
            {logoText.split(' - ')[0]}
          </span>
          {logoText.includes(' - ') && (
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">
              {logoText.split(' - ')[1]}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}