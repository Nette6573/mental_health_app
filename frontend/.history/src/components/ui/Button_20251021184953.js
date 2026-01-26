import Link from 'next/link'

export default function Button({ 
  href, 
  children, 
  variant = 'primary', 
  className = '',
  loading = false,
  ...props 
}) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary-600 hover:bg-gray-100 border border-gray-300',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    'outline-white': 'border-2 border-white text-white hover:bg-white/10'
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {loading ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={loading} {...props}>
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      {children}
    </button>
  )
}

const Spinner = ({ className = '' }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)