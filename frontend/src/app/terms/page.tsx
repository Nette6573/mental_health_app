export const metadata = {
  title: 'Terms and Conditions - HopePath',
  description: 'Read the Terms and Conditions for using HopePath services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 sm:px-10 py-10 text-white text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Terms and Conditions – HopePath
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base">
              Read the Terms and Conditions for using HopePath services.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 py-10">
            <div className="max-w-3xl mx-auto space-y-10 text-gray-700 dark:text-gray-200">

              <PolicySection title="1. User Acceptance of Terms">
                <p>
                  By accessing or using HopePath, you are agreeing to be bound by the terms and conditions specified herein, 
                  our Privacy Policy, and all applicable laws of Jamaica regarding the use, storage, and transmission of data, 
                  as outlined in the Data Protection Act (2020) and the Cybercrimes Act (2010, amended 2015). 
                  If you do not agree to these Terms, you must discontinue use of this and any other HopePath platforms.
                </p>
              </PolicySection>

              <PolicySection title="2. Nature of Services">
                <ul className="space-y-3 list-disc pl-6">
                  <li>HopePath does not give medical advice, medical diagnosis, treatment, or any perceived version of emergency services.</li>
                  <li>HopePath provides services such as mood tracking, journaling, emotional support, and referrals to licensed professionals.</li>
                  <li>Faith-based encouragement is optional, provided only with explicit user consent.</li>
                </ul>
              </PolicySection>

              <PolicySection title="3. User Eligibility">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Users must be 18 years or older to register on HopePath.</li>
                  <li>Users must agree to these Terms and Conditions to use HopePath.</li>
                  <li>Users must provide accurate information during and after the registration process.</li>
                  <li>Unauthorized use of another person’s account is strictly prohibited and violators will be prosecuted under the Cybercrimes Act (2010, amended 2015).</li>
                </ul>
              </PolicySection>

              <PolicySection title="4. User Responsibilities">
                <ul className="space-y-3 list-disc pl-6">
                  <li>All users agree to lawful and respectful use of HopePath.</li>
                  <li>Users are primarily responsible for maintaining the confidentiality of their login credentials.</li>
                  <li>Users must not use HopePath for harmful, abusive, or illegal activities.</li>
                  <li>Users must not use HopePath as a medium to seek medical treatment, medical advice, diagnoses, or emergency services.</li>
                </ul>
              </PolicySection>

              <PolicySection title="5. Data Protection & Privacy">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Unauthorized access, modification, and interception of data is a criminal offence in Jamaica under the Cybercrimes Act (2010, amended 2015).</li>
                  <li>All personal data is handled in compliance with Jamaica’s Data Protection Act (2020).</li>
                  <li>Confidential and sensitive information is encrypted and accessible only to the users who created it (e.g., journal entries, mood tracking).</li>
                  <li>Data may be shared with licensed professionals or law enforcement officials only with consent or legal obligation.</li>
                </ul>
              </PolicySection>

              <PolicySection title="6. Faith-Based Content">
                <ul className="space-y-3 list-disc pl-6">
                  <li>Users may choose not to interact with faith-based features at any time.</li>
                  <li>Faith-based encouragement is optional and only shown if users interact with the resources provided.</li>
                  <li>Faith-based content is moderated and segregated to ensure ethical and culturally sensitive delivery.</li>
                </ul>
              </PolicySection>

              <PolicySection title="7. Intellectual Property">
                <ul className="space-y-3 list-disc pl-6">
                  <li>HopePath is licensed to display all content, materials, design, and software contained herein.</li>
                  <li>Users must not copy, distribute, or modify any content without prior written consent.</li>
                </ul>
              </PolicySection>

              <PolicySection title="8. Limitation of Liability">
                <ul className="space-y-3 list-disc pl-6">
                  <li>HopePath provides support tools but does not guarantee outcomes.</li>
                  <li>HopePath is not liable for:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Misuse of the platform;</li>
                      <li>Technical interruptions or data breaches beyond reasonable safeguards;</li>
                      <li>Decisions made based on AI-generated content, interaction, or support.</li>
                    </ul>
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="9. Termination of Use">
                <ul className="space-y-3 list-disc pl-6">
                  <li>HopePath reserves the right to suspend or terminate accounts violating these Terms or future updates.</li>
                  <li>Users may terminate their accounts at any time for convenience.</li>
                </ul>
              </PolicySection>

              <PolicySection title="10. Amendment">
                <ul className="space-y-3 list-disc pl-6">
                  <li>These Terms may be updated periodically. Continued use requires agreement with updated Terms.</li>
                  <li>Users will be notified of changes via the platform or communication methods provided.</li>
                </ul>
              </PolicySection>

              <PolicySection title="11. Governing Law">
                <p>
                  HopePath is governed by the laws of Jamaica, specifically the Cybercrimes Act (2010, last amended 2015) and the Data Protection Act (2020).
                </p>
              </PolicySection>

              <PolicySection title="12. Contact Information">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-5 border border-gray-200 dark:border-gray-600">
                  <p>
                    HopePath<br />
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