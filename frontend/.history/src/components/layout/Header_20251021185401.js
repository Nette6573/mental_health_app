'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/shared/Logo'
import DarkModeToggle from './DarkModeToggle'
import Button from '@/components/ui/Button'
import { navigation } from '@/constants/data'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const pathname = usePathname()

  // Check authentication status (you'll replace this with your actual auth logic)
  useEffect(() => {
    // Simulate checking if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      setIsLoggedIn(!!token)
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    checkAuth()
    
    // Listen for auth changes (you can use context or state management in real app)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setUser(null)
    setIsMobileMenuOpen(false)
    // Redirect to home page
    window.location.href = '/'
  }

  const isAuthPage = pathname?.includes('/auth/')

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                  pathname === item.href ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* CTA & Auth Buttons */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {isLoggedIn ? (
              // User is logged in - show user menu
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.firstName || 'User'}
                  </span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="hidden sm:inline-flex text-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              // User is not logged in - show auth buttons
              <div className="flex items-center space-x-3">
                {!isAuthPage && (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Button 
                      href="/auth/signup" 
                      variant="primary" 
                      className="hidden sm:inline-flex text-sm"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4`}>
          <div className="flex flex-col space-y-4">
            {/* Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 ${
                  pathname === item.href ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              {isLoggedIn ? (
                // Mobile logged in state
                <>
                  <div className="flex items-center space-x-3 pb-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="block text-center bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Mobile not logged in state
                <>
                  <Link 
                    href="/auth/login" 
                    className="block text-center border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block text-center bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}