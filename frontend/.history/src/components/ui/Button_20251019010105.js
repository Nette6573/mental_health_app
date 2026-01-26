import Link from 'next/link'

export default function Button({ 
  href, 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center'
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-white text-primary-600 hover:bg-gray-100',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    'outline-white': 'border-2 border-white text-white hover:bg-white/10'
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}