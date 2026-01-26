import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Partners() {
  const partners = [
    { 
      name: "Medical Council", 
      description: "Regulatory oversight for healthcare standards",
      logo: "MCJ"
    },
    { 
      name: "JPA", 
      description: "Psychological professionals association",
      logo: "JPA"
    },
    { 
      name: "Christian Therapists", 
      description: "Faith-based counseling network",
      logo: "JACT"
    },
    { 
      name: "Churches United", 
      description: "Interchurch mental health initiative",
      logo: "CUH"
    },
    { 
      name: "Mental Health Foundation", 
      description: "Regional advocacy organization",
      logo: "CMHF"
    },
    { 
      name: "Healing Bridges", 
      description: "Parent organization & sponsor",
      logo: "HBI"
    },
    { 
      name: "Counsellors Association", 
      description: "Professional counseling body",
      logo: "JCA"
    },
    { 
      name: "Faith & Wellness", 
      description: "Interfaith health alliance",
      logo: "FWA"
    }
  ]

  return (
    <section id="partners" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-primary-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
            Trusted Collaborations
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary-600">Partners</span> & Supporters
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Working together with leading organizations to transform mental health support in Jamaica
          </p>
        </AnimatedSection>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <AnimatedSection 
              key={partner.name} 
              animation="slide-up" 
              delay={index * 0.1}
            >
              <div className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-xl cursor-pointer">
                
                {/* Logo with Hover Effect */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="font-heading font-bold text-white text-sm">
                      {partner.logo}
                    </span>
                  </div>
                  <div className="absolute -inset-2 bg-primary-200 dark:bg-primary-800 rounded-lg opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                </div>
                
                {/* Partner Name */}
                <h4 className="font-heading font-semibold text-gray-800 dark:text-white mb-2 text-sm md:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {partner.name}
                </h4>
                
                {/* Description - Shows on Hover */}
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-2xl border border-gray-100 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight">
                    {partner.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats Section */}
        <AnimatedSection animation="fade-in" delay={0.6} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "50+", label: "Professionals" },
              { number: "25+", label: "Churches" },
              { number: "15+", label: "Communities" },
              { number: "100%", label: "Commitment" }
            ].map((stat, index) => (
              <div key={stat.label} className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
                <div className="text-2xl md:text-3xl font-heading font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}