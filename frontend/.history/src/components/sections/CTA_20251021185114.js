import Button from '@/components/ui/Button'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function CTA() {
  return (
    <section id="get-started" className="py-16 gradient-bg text-white">
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection animation="fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Path to Healing?</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={0.1}>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join HopePath today and take the first step toward mental wellness with faith-based support.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={0.2} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button href="/Signup" variant="secondary" className="text-primary-600 bg-white hover:bg-gray-100">
            Create Your Account
          </Button>
          <Button href="#" variant="outline-white">
            Learn More
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}