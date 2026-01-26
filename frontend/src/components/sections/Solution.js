import Card from '@/components/ui/Card'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionDivider from '@/components/shared/SectionDivider'

export default function Solution() {
  return (
    <section id="solution" className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">The HopePath Solution</h2>
          <p className="text-lg max-w-3xl mx-auto">A comprehensive digital platform bridging faith and mental health support</p>
        </AnimatedSection>
        
        {/* AI Assessment Section */}
        <div className="flex flex-col lg:flex-row items-center mb-16">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <AnimatedSection animation="slide-up">
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-6">AI-Powered Mental Health Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our GPT-powered conversational module assesses user responses to identify potential mental health concerns like depression, anxiety, low self-esteem, or bipolar tendencies.
              </p>
              <ul className="space-y-3">
                {[
                  "Early identification of mental health challenges",
                  "Tailored interventions and recommendations",
                  "Scripture-based encouragement and guidance"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <AnimatedSection animation="slide-up" delay={0.2}>
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-1 rounded-2xl shadow-xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">How have you been feeling lately?</p>
                  </div>
                  <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg">
                    <p className="text-sm">I&apos;ve been feeling really down and haven&apos;t had much energy...</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {["I understand", "Tell me more", "Scripture"].map((text, index) => (
                      <div key={index} className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-xs">
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        <SectionDivider className="my-12" />
        
        {/* Directory Section */}
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 order-2 lg:order-1">
            <AnimatedSection animation="slide-up">
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-6">Professional & Faith-Based Directory</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect with licensed therapists, psychologists, and supportive churches across Jamaica through our comprehensive directory.
              </p>
              <ul className="space-y-3">
                {[
                  "Search by location and specialty",
                  "Verified credentials and reviews",
                  "Direct booking and contact options"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
          <div className="lg:w-1/2 flex justify-center order-1 lg:order-2">
            <AnimatedSection animation="slide-up" delay={0.2}>
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-1 rounded-2xl shadow-xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-heading font-bold text-lg">Find Support Near You</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        ),
                        name: "Dr. Sarah Johnson",
                        role: "Clinical Psychologist • Kingston",
                        rating: "4.8 (124 reviews)"
                      },
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        ),
                        name: "Grace Community Church",
                        role: "Support Groups • Montego Bay",
                        rating: "4.9 (87 reviews)"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.role}</p>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs ml-1">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium transition-colors">
                    View All Resources
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}