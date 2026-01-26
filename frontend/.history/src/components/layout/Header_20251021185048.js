'use client'

import { useState } from 'react'
import Logo from '@/components/shared/Logo'
import DarkModeToggle from './DarkModeToggle'
import Button from '@/components/ui/Button'
import { navigation } from '@/constants/data'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* CTA & Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Button href="/signup" variant="primary" className="hidden sm:inline-flex">
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4`}>
          <div className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Button href="#get-started" variant="primary" className="w-full justify-center">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}