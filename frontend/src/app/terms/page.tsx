// frontend/src/app/terms/page.tsx
export const metadata = {
  title: 'Terms and Conditions - HopePath',
  description: 'Read the Terms and Conditions for using HopePath services.',
};

export default function TermsPage() {
  return (
    <div className="prose mx-auto p-6">
      <h1>Terms and Conditions – HopePath</h1>

      <h2>1. User Acceptance of Terms</h2>
      <p>
        By accessing or using HopePath, you are agreeing to be bound by the terms and conditions specified herein, 
        our Privacy Policy, and all applicable laws of Jamaica regarding the use, storage, and transmission of data, 
        as outlined in the Data Protection Act (2020) and the Cybercrimes Act (2010, amended 2015). 
        If you do not agree to these Terms, you must discontinue use of this and any other HopePath platforms.
      </p>

      <h2>2. Nature of Services</h2>
      <ul>
        <li>HopePath does not give medical advice, medical diagnosis, treatment, or any perceived version of emergency services.</li>
        <li>HopePath provides services such as mood tracking, journaling, emotional support, and referrals to licensed professionals.</li>
        <li>Faith-based encouragement is optional, provided only with explicit user consent.</li>
      </ul>

      <h2>3. User Eligibility</h2>
      <ul>
        <li>Users must be 18 years or older to register on HopePath.</li>
        <li>Users must agree to these Terms and Conditions to use HopePath.</li>
        <li>Users must provide accurate information during and after the registration process.</li>
        <li>Unauthorized use of another person’s account is strictly prohibited and violators will be prosecuted under the Cybercrimes Act (2010, amended 2015).</li>
      </ul>

      <h2>4. User Responsibilities</h2>
      <ul>
        <li>All users agree to lawful and respectful use of HopePath.</li>
        <li>Users are primarily responsible for maintaining the confidentiality of their login credentials.</li>
        <li>Users must not use HopePath for harmful, abusive, or illegal activities.</li>
        <li>Users must not use HopePath as a medium to seek medical treatment, medical advice, diagnoses, or emergency services.</li>
      </ul>

      <h2>5. Data Protection & Privacy</h2>
      <ul>
        <li>Unauthorized access, modification, and interception of data is a criminal offence in Jamaica under the Cybercrimes Act (2010, amended 2015).</li>
        <li>All personal data is handled in compliance with Jamaica’s Data Protection Act (2020).</li>
        <li>Confidential and sensitive information is encrypted and accessible only to the users who created it (e.g., journal entries, mood tracking).</li>
        <li>Data may be shared with licensed professionals or law enforcement officials only with consent or legal obligation.</li>
      </ul>

      <h2>6. Faith-Based Content</h2>
      <ul>
        <li>Users may choose not to interact with faith-based features at any time.</li>
        <li>Faith-based encouragement is optional and only shown if users interact with the resources provided.</li>
        <li>Faith-based content is moderated and segregated to ensure ethical and culturally sensitive delivery.</li>
      </ul>

      <h2>7. Intellectual Property</h2>
      <ul>
        <li>HopePath is licensed to display all content, materials, design, and software contained herein.</li>
        <li>Users must not copy, distribute, or modify any content without prior written consent.</li>
      </ul>

      <h2>8. Limitation of Liability</h2>
      <ul>
        <li>HopePath provides support tools but does not guarantee outcomes.</li>
        <li>HopePath is not liable for:
          <ul>
            <li>Misuse of the platform;</li>
            <li>Technical interruptions or data breaches beyond reasonable safeguards;</li>
            <li>Decisions made based on AI-generated content, interaction, or support.</li>
          </ul>
        </li>
      </ul>

      <h2>9. Termination of Use</h2>
      <ul>
        <li>HopePath reserves the right to suspend or terminate accounts violating these Terms or future updates.</li>
        <li>Users may terminate their accounts at any time for convenience.</li>
      </ul>

      <h2>10. Amendment</h2>
      <ul>
        <li>These Terms may be updated periodically. Continued use requires agreement with updated Terms.</li>
        <li>Users will be notified of changes via the platform or communication methods provided.</li>
      </ul>

      <h2>11. Governing Law</h2>
      <p>
        HopePath is governed by the laws of Jamaica, specifically the Cybercrimes Act (2010, last amended 2015) and the Data Protection Act (2020).
      </p>

      <h2>12. Contact Information</h2>
      <p>
        HopePath<br />
        Email: privacy@hopepath.online<br />
        Phone: 1 (658) 432-5674
      </p>
    </div>
  );
}
