import React from "react";
import LegalPageLayout, { PolicySection } from "../components/common/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      seoTitle="Privacy Policy | Wisdom Peters"
      seoDescription="How Wisdom Peters collects, uses, and protects your personal information when you use our bookstore and website."
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains how we handle your personal data."
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Privacy Policy" },
      ]}
    >
      <PolicySection title="1. Who We Are">
        <p>
          Wisdom Peters ("we", "us", "our") operates the Wisdom Peters bookstore website. We are based in Manchester, United Kingdom. For privacy enquiries, contact{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="2. Information We Collect">
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Account information:</strong> name, email address, password (stored securely hashed)</li>
          <li><strong>Order information:</strong> billing details, shipping address, purchase history</li>
          <li><strong>Payment information:</strong> processed by PayPal (we do not store full card or PayPal account details)</li>
          <li><strong>Communication data:</strong> messages sent via contact forms or email, including optional phone numbers</li>
          <li><strong>Usage data:</strong> pages visited, device type, browser, IP address, and cookies</li>
          <li><strong>Course progress:</strong> enrollment status and lesson completion for purchased courses</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Process orders and deliver products and course access</li>
          <li>Manage your account and provide customer support</li>
          <li>Send order confirmations, receipts, and service-related communications</li>
          <li>Respond to coaching, speaking, and general enquiries</li>
          <li>Improve our website, products, and user experience</li>
          <li>Send marketing communications where you have opted in (you may unsubscribe at any time)</li>
          <li>Comply with legal obligations and prevent fraud</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Legal Basis for Processing (UK/EU)">
        <p>Where applicable under UK GDPR, we process personal data based on:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Contract:</strong> to fulfil purchases and provide account services</li>
          <li><strong>Consent:</strong> for marketing emails and optional communications</li>
          <li><strong>Legitimate interests:</strong> to improve our services and maintain site security</li>
          <li><strong>Legal obligation:</strong> where required by law</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Sharing Your Information">
        <p>We do not sell your personal data. We may share information with:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>PayPal, our payment processor, to complete transactions</li>
          <li>Delivery and fulfilment partners for physical orders</li>
          <li>Email and hosting service providers</li>
          <li>Analytics tools to understand site usage (in anonymised or aggregated form where possible)</li>
          <li>Law enforcement or regulators when required by law</li>
        </ul>
        <p>All third-party providers are required to handle data securely and only for specified purposes.</p>
      </PolicySection>

      <PolicySection title="6. Cookies">
        <p>
          We use cookies and similar technologies to keep you signed in, remember preferences, and analyse site traffic. You can control cookies through your browser settings. Disabling cookies may affect certain site features.
        </p>
      </PolicySection>

      <PolicySection title="7. Data Retention">
        <p>
          We retain personal data only as long as necessary for the purposes described in this policy, including to fulfil orders, maintain accounts, resolve disputes, and meet legal requirements. Order records are typically retained for up to 7 years for accounting and tax purposes.
        </p>
      </PolicySection>

      <PolicySection title="8. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (subject to legal exceptions)</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability where applicable</li>
          <li>Withdraw consent for marketing at any time</li>
          <li>Lodge a complaint with the ICO (UK) or your local data protection authority</li>
        </ul>
        <p>
          To exercise these rights, email{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="9. Security">
        <p>
          We implement appropriate technical and organisational measures to protect your data, including encryption in transit (HTTPS) and secure payment processing. However, no method of transmission over the internet is 100% secure.
        </p>
      </PolicySection>

      <PolicySection title="10. Children's Privacy">
        <p>
          Our Site is not intended for children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us so we can delete it.
        </p>
      </PolicySection>

      <PolicySection title="11. International Transfers">
        <p>
          Your data may be processed in the United Kingdom or in countries where our service providers operate. Where data is transferred outside the UK, we ensure appropriate safeguards are in place as required by applicable law.
        </p>
      </PolicySection>

      <PolicySection title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
        </p>
      </PolicySection>

      <PolicySection title="13. Contact">
        <p>
          For privacy-related questions, contact{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>{" "}
          or write to us at Manchester, United Kingdom.
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
