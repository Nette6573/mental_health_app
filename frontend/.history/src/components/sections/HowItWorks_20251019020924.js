import Button from '@/components/ui/Button'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description: "Sign up securely and set up your profile. Your privacy is protected with end-to-end encryption."
    },
    {
      number: 2,
      title: "Complete Assessment",
      description: "Engage with our AI-powered conversational module to identify areas where you might need support."
    },
    {
      number: 3,
      title: "Get Personalized Support",
      description: "Receive tailored recommendations, connect with professionals, and access faith-based resources."
    }
  ]

  return (
    <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How HopePath Works</h2>
          <p className="text-lg max-w-3xl mx-auto">A simple, secure process to get the support you need</p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={step.number} 
              animation="slide-up" 
              delay={index * 0.1}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection animation="fade-in" delay={0.4} className="mt-12 text-center">
          <Button href="#get-started" variant="primary">
            Start Your Journey Today
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}