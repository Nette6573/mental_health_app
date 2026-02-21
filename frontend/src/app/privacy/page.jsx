// app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy - HopePath',
  description: 'Learn how HopePath protects your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="prose mx-auto p-6">
      <h1>Privacy Policy – HopePath</h1>

      <p>
        HopePath is committed to protecting the privacy and security of all user
        information. This Privacy Policy explains how your data is collected,
        stored, used, and safeguarded in accordance with Jamaican legislation,
        including the Data Protection Act (2020) and the Cybercrimes Act
        (2010/2015).
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Personally Identifiable Information (PII):</strong> name, email, phone number.</li>
        <li><strong>Usage Data:</strong> mood logs, chats with Paula, journaling entries.</li>
        <li><strong>Technical Data:</strong> browser, device type, IP address.</li>
        <li><strong>Optional Faith Data:</strong> only if the user opts in.</li>
      </ul>

      <h2>Legal Basis for Collection</h2>
      <ul>
        <li>User consent for optional features.</li>
        <li>Legitimate operational needs (authentication, crisis escalation).</li>
        <li>Compliance with Jamaican Cybercrimes Act.</li>
      </ul>

      <h2>Use of Information</h2>
      <ul>
        <li>To comply with Jamaican data laws.</li>
        <li>To provide secure access to HopePath services.</li>
        <li>To escalate crises when necessary.</li>
        <li>To improve system performance and safety.</li>
        <li>To support empathetic conversation with Paula.</li>
      </ul>

      <h2>Data Protection & Security</h2>
      <ul>
        <li>Encryption in transit and at rest.</li>
        <li>Tiered administrative access.</li>
        <li>Auditing and activity monitoring.</li>
        <li>Incident response following Jamaican law.</li>
      </ul>

      <h2>User Rights</h2>
      <ul>
        <li>Withdraw consent.</li>
        <li>Request data correction or deletion.</li>
        <li>Report misuse.</li>
        <li>Access personal data.</li>
      </ul>

      <h2>Data Retention</h2>
      <ul>
        <li>User-generated content until account deletion.</li>
        <li>Administrative records as required by law.</li>
        <li>Crisis logs kept no longer than 12 months.</li>
      </ul>

      <h2>Third-Party Sharing</h2>
      <ul>
        <li>With vetted providers under strict contracts.</li>
        <li>With law enforcement when legally required.</li>
        <li>With licensed mental health professionals (with consent).</li>
      </ul>

      <h2>Compliance with Jamaican Laws</h2>
      <ul>
        <li>Telemedicine Guidelines (2025)</li>
        <li>Data Protection Act (2020)</li>
        <li>Cybercrimes Act (2010/2015)</li>
      </ul>

      <h2>Policy Updates</h2>
      <p>
        HopePath may update this Privacy Policy periodically. Users will be
        notified through the app or email.
      </p>

      <h2>Contact Information</h2>
      <p>
        Healing Bridges Inc.<br />
        Email: privacy@hopepath.online<br />
        Phone: 1 (658) 432-5674
      </p>
    </div>
  );
}
