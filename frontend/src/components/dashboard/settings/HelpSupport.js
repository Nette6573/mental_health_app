'use client'

import { useState } from 'react'

export default function HelpSupport({ user }) {
  const [activeTab, setActiveTab] = useState('faq')
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    urgency: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqCategories = [
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'You can reset your password by going to Settings > Account Security > Change Password. You will need to enter your current password and then create a new one.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can change your email address in the Account Security section. You will need to verify your new email address before it becomes active.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Account deletion is available in the Privacy Settings. Please note that this action is permanent and cannot be undone.'
        }
      ]
    },
    {
      category: 'Prayer & Community',
      questions: [
        {
          question: 'How do I post a prayer request?',
          answer: 'Navigate to the Prayer Wall section and click "Add Prayer Request". You can choose to post publicly or keep it private.'
        },
        {
          question: 'Can I pray for others anonymously?',
          answer: 'Yes, when you pray for someone, your identity is kept private by default unless you choose to reveal it.'
        },
        {
          question: 'How does the community work?',
          answer: 'Our community is a safe space for believers to connect, share, and support each other through prayer and encouragement.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'The app is loading slowly, what should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, contact our support team.'
        },
        {
          question: 'I am having trouble uploading photos',
          answer: 'Ensure your image is under 5MB and in a supported format (JPG, PNG, GIF). If problems continue, try using a different browser.'
        },
        {
          question: 'How do I enable notifications?',
          answer: 'Go to Settings > Notifications to manage your notification preferences for email, push, and SMS alerts.'
        }
      ]
    }
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Reset form
    setContactForm({
      subject: '',
      category: 'general',
      message: '',
      urgency: 'normal'
    })
    // Show success message
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get help, report issues, or contact our support team
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'faq', name: 'FAQ', icon: '❓' },
            { id: 'contact', name: 'Contact Support', icon: '💬' },
            { id: 'resources', name: 'Resources', icon: '📚' },
            { id: 'status', name: 'System Status', icon: '🟢' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find quick answers to common questions about using MindCare
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map(category => (
              <div key={category.category} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{category.category}</h4>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                      <details className="group">
                        <summary className="flex justify-between items-center font-medium text-gray-900 dark:text-white cursor-pointer list-none">
                          <span>{faq.question}</span>
                          <span className="transition group-open:rotate-180">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </summary>
                        <div className="text-gray-600 dark:text-gray-400 mt-3 pl-4 border-l-2 border-primary-500">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 text-center">
            <h4 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">Still need help?</h4>
            <p className="text-primary-700 dark:text-primary-400 mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Contact Support */}
      {activeTab === 'contact' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get in touch with our support team. We typically respond within 24 hours.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={contactForm.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={contactForm.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low - General question</option>
                  <option value="normal">Normal - Need help</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - System down</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Please describe your issue in detail..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>Tip:</strong> Include specific details like what you were doing when the issue occurred, 
                  any error messages you saw, and steps to reproduce the problem.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message to Support'}
            </button>
          </form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-medium text-gray-900 dark:text-white">Email</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">support@mindcare.com</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🕒</div>
              <div className="font-medium text-gray-900 dark:text-white">Response Time</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Within 24 hours</div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🌎</div>
              <div className="font-medium text-gray-900 dark:text-white">Availability</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">24/7 for urgent issues</div>
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Helpful Resources</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Additional resources to help you get the most out of MindCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'User Guide',
                description: 'Complete guide to all MindCare features',
                icon: '📖',
                link: '#',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Video Tutorials',
                description: 'Step-by-step video guides',
                icon: '🎬',
                link: '#',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Community Guidelines',
                description: 'Our community standards and rules',
                icon: '🤝',
                link: '#',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Prayer Guide',
                description: 'How to make the most of prayer features',
                icon: '🙏',
                link: '#',
                color: 'from-orange-500 to-orange-600'
              },
              {
                title: 'Safety & Privacy',
                description: 'Learn about our security measures',
                icon: '🛡️',
                link: '#',
                color: 'from-red-500 to-red-600'
              },
              {
                title: 'API Documentation',
                description: 'For developers building integrations',
                icon: '⚙️',
                link: '#',
                color: 'from-indigo-500 to-indigo-600'
              }
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-lg flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {resource.icon}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      {activeTab === 'status' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check the current status of MindCare services
            </p>
          </div>

          <div className="space-y-6">
            {[
              { service: 'Web Application', status: 'operational', description: 'Main website and dashboard' },
              { service: 'Mobile App', status: 'operational', description: 'iOS and Android applications' },
              { service: 'API Services', status: 'operational', description: 'Backend API and data services' },
              { service: 'Database', status: 'operational', description: 'User data and content storage' },
              { service: 'Notifications', status: 'degraded', description: 'Email and push notifications' },
              { service: 'File Uploads', status: 'operational', description: 'Profile pictures and attachments' }
            ].map((system, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    system.status === 'operational' ? 'bg-green-500' :
                    system.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{system.service}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{system.description}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  system.status === 'operational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  system.status === 'degraded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Last Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              System status last checked: {new Date().toLocaleString()} <br />
              Next update scheduled: {new Date(Date.now() + 5 * 60 * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}