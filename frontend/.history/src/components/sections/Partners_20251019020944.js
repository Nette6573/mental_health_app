import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Partners() {
  const partners = [
    { name: "Medical Council" },
    { name: "JPA" },
    { name: "Churches United" },
    { name: "Healing Bridges" }
  ]

  return (
    <section id="partners" className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Trusted Partners</h2>
          <p className="text-lg max-w-3xl mx-auto">Collaborating with leading mental health and faith-based organizations across Jamaica</p>
        </AnimatedSection>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
          {partners.map((partner, index) => (
            <AnimatedSection 
              key={partner.name} 
              animation="fade-in" 
              delay={index * 0.1}
              className="bg-gray-100 dark:bg-gray-700 h-20 w-32 rounded-lg flex items-center justify-center"
            >
              <span className="font-heading font-semibold text-gray-600 dark:text-gray-300">
                {partner.name}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}