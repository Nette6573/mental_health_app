'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedSection({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  className = '',
  threshold = 0.1 
}) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.style.animationPlayState = 'running'
            }
          }, delay * 1000)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      ref.current.style.animationPlayState = 'paused'
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold])

  return (
    <div 
      ref={ref}
      className={`animate-${animation} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}