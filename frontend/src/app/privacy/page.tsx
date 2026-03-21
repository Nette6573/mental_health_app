export const metadata = {
  title: 'Privacy Policy - HopePath',
  description: 'Learn how HopePath protects your privacy.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 sm:px-10 py-10 text-white text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Privacy Policy – HopePath
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base">
              Learn how HopePath protects your privacy.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 py-10">
            <div className="max-w-3xl mx-auto space-y-10 text-gray-700 dark:text-gray-200">
              <section className="space-y-5 text-base leading-8">
                <p>
                  HopePath is extremely committed to protecting the privacy and security of all its users’ data and inputted information. 
                  This document serves as the official Privacy Policy, which explains how user data is collected, stored, used, and safeguarded, particularly that of personally identifiable information. 
                  HopePath systems, storage mechanisms, and designs comply with the Jamaica Data Protection Act (2020) and the Cybercrimes Act (2010, last amended 2015).
                </p>

                <p>
                  HopePath is designed to provide emotional support, mood tracking, journaling tools, and referral pathways to licensed mental health professionals. 
                  All our users need to understand in its entirety that we do not provide medical diagnosis or treatment.
                </p>
              </section>

              <PolicySection title="Information We Collect">
                <ul className="space-y-3 list-disc pl-6">
                  <li><strong>Personally Identifiable Information (PII):</strong> Full names, email, phone number (for registration).</li>
                  <li><strong>Usage Data:</strong> Mood tracking logs, chat information with Paula, and journaling entries.</li>
                  <li><strong>Technical Data:</strong> Browser information, IP address, and device type.</li>
                  <li><strong>Optional Faith Data:</strong> Only if the user opts in, data surrounding scripture-based content and encouragements will be collected, to ensure that the information provided is accurate to the user’s expectations.</li>
                </ul>
                <p className="mt-5">
                  Information that is considered to be sensitive and/or private, such as mental health notes, is handled with the highest confidentiality and the strictest of security.
                </p>
              </PolicySection>

              <PolicySection title="Legal Basis for Collection">
                <ul className="space-y-3 list-disc pl-6">
                  <li>With users consent whenever they opt in to our programs, such as faith-based support or journaling.</li>
                  <li>For legitimate operation needs, e.g., crisis escalation, authentication, etc.</li>
                  <li>In compliance with the Cybercrimes Act, HopePath will prohibit unauthorized access, misuse, and modification of data.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Use of Information">
                <ul className="space-y-3 list-disc pl-6">
                  <li>To maintain compliance with the legislation that governs data use, software, and storage in Jamaica.</li>
                  <li>Provide secure access to HopePath Services.</li>
                  <li>Escalate crises to Jamaican mental health hotlines when necessary.</li>
                  <li>Improve HopePath’s platform and systems to enhance performance and safety.</li>
                  <li>Deliver empathetic conversational support via Paula.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Data Protection & Security">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Encryption: All sensitive data is encrypted both in transit and at rest.</li>
                  <li>Access Control: Only authorized and tiered administrators will have access to system logs and data on a need-to-know basis.</li>
                  <li>Monitoring: All activities and trails will be audited and maintained.</li>
                  <li>Incident Response: Reported breaches will be dealt with in accordance with the Data Protection Act and the Cybercrimes Act.</li>
                </ul>
              </PolicySection>

              <PolicySection title="User Rights">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Withdraw Consent for optional features.</li>
                  <li>Request correction or deletion of personal data.</li>
                  <li>Report misuse to Jamaican authorities.</li>
                  <li>Access or be given access to their personal data.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Data Retention">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Journaling and mood tracking data will be retained until the user deletes or closes their account.</li>
                  <li>Administrative records will be retained as required by law.</li>
                  <li>Crisis escalation logs will be retained for a period not exceeding 12 months, in compliance with Jamaican legislation.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Third-Party Sharing">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Data may be shared only with vetted third-party services, under strict contracts to ensure compliance (e.g., hosting, authentication, servers, databases).</li>
                  <li>With law enforcement, if required under the Cybercrimes Act.</li>
                  <li>With licensed professionals for referrals, with customer consent required.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Compliance with Jamaican Laws">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Telemedicine Guidelines (2025): Aligns with ethical standards for digital health platforms.</li>
                  <li>Data Protection Act (2020): Ensures lawful processing, securing, and handling of sensitive user information, observing user rights.</li>
                  <li>Cybercrimes Act (2010, last amended 2015): Guides HopePath on the prevention of unauthorized access, interception, and misuse of data.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Policy Updates">
                <p>
                  This Privacy Policy will be updated periodically. All users will be notified of any and all changes via HopePath’s platforms or other specified communication methods.
                </p>
              </PolicySection>

              <PolicySection title="Contact Information">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-5 border border-gray-200 dark:border-gray-600">
                  <p>
                    Healing Bridges Inc.<br />
                    Email: privacy@hopepath.online<br />
                    Phone: 1 (658) 432-5674
                  </p>
                </div>
              </PolicySection>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 shadow-sm p-6 sm:p-7">
      <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-5">
        {title}
      </h2>
      <div className="text-base leading-8 text-gray-700 dark:text-gray-200">
        {children}
      </div>
    </section>
  );
}