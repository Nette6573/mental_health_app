'use client'

import Hero from '@/components/sections/Hero'
import ProblemStatement from '@/components/sections/ProblemStatement'
import Solution from '@/components/sections/Solution'
import HowItWorks from '@/components/sections/HowItWorks'
import Partners from '@/components/sections/Partners'
import CTA from '@/components/sections/CTA'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Header />
        <Hero />
        <ProblemStatement />
        <Solution />
        <HowItWorks />
        <Partners />
        <CTA />
      </main>
    </div>
  )
}