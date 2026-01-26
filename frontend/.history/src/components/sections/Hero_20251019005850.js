import Button from '@/components/ui/Button'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Hero() {
  return (
    <section className="gradient-bg text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <AnimatedSection animation="slide-up">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Faith-Based Mental Health Support for Jamaica
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Combining biblical encouragement with professional mental health resources to guide you toward healing and hope.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button href="#get-started" variant="secondary" className="text-primary-600 bg-white hover:bg-gray-100">
                  Start Your Journey
                </Button>
                <Button href="#how-it-works" variant="outline-white">
                  Learn More
                </Button>
              </div>
            </AnimatedSection>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <AnimatedSection animation="float">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-48 h-48 md:w-60 md:h-60 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/30 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-20 md:w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}