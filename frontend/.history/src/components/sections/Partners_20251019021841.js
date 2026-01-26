import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Partners() {
  const partners = [
    { 
      name: "Medical Council of Jamaica", 
      description: "Regulatory body for medical professionals",
      logo: "MCJ",
      type: "regulatory"
    },
    { 
      name: "Jamaica Psychological Association", 
      description: "Professional organization for psychologists",
      logo: "JPA",
      type: "professional"
    },
    { 
      name: "Jamaica Association of Christian Therapists", 
      description: "Network of faith-based mental health professionals",
      logo: "JACT",
      type: "faith-based"
    },
    { 
      name: "Churches United for Healing", 
      description: "Coalition of churches providing mental health support",
      logo: "CUH",
      type: "faith-based"
    },
    { 
      name: "Caribbean Mental Health Foundation", 
      description: "Regional mental health advocacy and support",
      logo: "CMHF",
      type: "non-profit"
    },
    { 
      name: "Healing Bridges Inc.", 
      description: "Parent organization and primary sponsor",
      logo: "HBI",
      type: "non-profit"
    },
    { 
      name: "Jamaica Counsellors Association", 
      description: "Professional body for licensed counsellors",
      logo: "JCA",
      type: "professional"
    },
    { 
      name: "Faith & Wellness Alliance", 
      description: "Interfaith mental health initiative",
      logo: "FWA",
      type: "faith-based"
    }
  ]

  // Group partners by type for better organization
  const groupedPartners = {
    'regulatory': partners.filter(p => p.type === 'regulatory'),
    'professional': partners.filter(p => p.type === 'professional'),
    'faith-based': partners.filter(p => p.type === 'faith-based'),
    'non-profit': partners.filter(p => p.type === 'non-profit')
  }

  const typeLabels = {
    'regulatory': 'Regulatory Bodies',
    'professional': 'Professional Associations',
    'faith-based': 'Faith-Based Organizations',
    'non-profit': 'Non-Profit Partners'
  }

  return (
    <section id="partners" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our Trusted <span className="text-primary-600">Partners</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Collaborating with leading mental health and faith-based organizations across Jamaica to provide comprehensive support
          </p>
        </AnimatedSection>

        {/* Grouped Partners Display */}
        <div className="space-y-12">
          {Object.entries(groupedPartners).map(([type, typePartners]) => (
            typePartners.length > 0 && (
              <div key={type} className="space-y-6">
                <AnimatedSection animation="slide-up" className="text-center">
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    {typeLabels[type]}
                  </h3>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {typePartners.map((partner, index) => (
                    <AnimatedSection 
                      key={partner.name} 
                      animation="slide-up" 
                      delay={index * 0.1}
                    >
                      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 hover:scale-105">
                        {/* Logo Container */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                            <span className="font-heading font-bold text-white text-lg">
                              {partner.logo}
                            </span>
                          </div>
                        </div>
                        
                        {/* Partner Info */}
                        <div className="text-center">
                          <h4 className="font-heading font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {partner.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {partner.description}
                          </p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-1 -translate-y-1" />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Partnership Callout */}
        <AnimatedSection animation="fade-in" delay={0.5} className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-primary-100 dark:border-gray-600">
            <h3 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Interested in Partnering with Us?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our network of organizations committed to improving mental health support in Jamaica through faith-based and professional collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                Become a Partner
              </button>
              <button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}