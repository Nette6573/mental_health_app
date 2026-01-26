import Logo from '@/components/shared/Logo'

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'The Problem', href: '#problem' },
    { name: 'Our Solution', href: '#solution' },
    { name: 'How It Works', href: '#how-it-works' },
  ]

  const resources = [
    { name: 'Crisis Helpline', href: '#' },
    { name: 'Find a Therapist', href: '#' },
    { name: 'Faith Resources', href: '#' },
    { name: 'Blog', href: '#' },
  ]

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo darkMode />
            </div>
            <p className="text-gray-400 text-sm">
              A faith-based mental health platform by Healing Bridges Inc.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a href={resource.href} className="hover:text-white transition-colors">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>help@hopepath.org</li>
              <li>+1 (876) 555-HELP</li>
              <li>Kingston, Jamaica</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 text-center">
          <p>&copy; 2025 HopePath by Healing Bridges Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}