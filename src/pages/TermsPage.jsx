import React from "react";
import { Link } from "react-router-dom";
import LegalPageLayout, { PolicySection } from "../components/common/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout
      seoTitle="Terms of Service | Wisdom Peters"
      seoDescription="Terms and conditions for using the Wisdom Peters bookstore website and purchasing books, courses, and digital products."
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our website or making a purchase."
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Terms of Service" },
      ]}
    >
      <PolicySection title="1. Agreement to Terms">
        <p>
          By accessing or using the Wisdom Peters website and bookstore (the "Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.
        </p>
        <p>
          These terms apply to all visitors, customers, and users of the Site, including purchases of books, e-books, online courses, and related digital products.
        </p>
      </PolicySection>

      <PolicySection title="2. Use of the Site">
        <p>You agree to use the Site only for lawful purposes. You must not:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to gain unauthorised access to accounts, systems, or data</li>
          <li>Share, copy, or redistribute course content except as expressly permitted</li>
          <li>Use the Site to transmit harmful, offensive, or fraudulent content</li>
          <li>Interfere with the proper functioning of the Site or its security features</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Accounts">
        <p>
          You may need to create an account to purchase products or access courses. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.
        </p>
        <p>
          You must provide accurate registration information and notify us promptly of any unauthorised use of your account.
        </p>
      </PolicySection>

      <PolicySection title="4. Products & Purchases">
        <p>
          Product descriptions, prices, and availability are subject to change without notice. We reserve the right to limit quantities, refuse orders, or cancel transactions where necessary.
        </p>
        <p>
          Digital products, including online courses and e-books, are licensed for personal, non-commercial use unless otherwise stated. Course access is granted to the purchasing account holder only.
        </p>
      </PolicySection>

      <PolicySection title="5. Payment">
        <p>
          Payments are processed securely through PayPal. By submitting payment information, you confirm that you are authorised to use the selected payment method and agree to PayPal&apos;s terms of service where applicable.
        </p>
        <p>
          All prices are displayed in the currency you select on the site (default: GBP). Converted amounts are shown at checkout based on current exchange rates. You are responsible for any applicable taxes, duties, or fees associated with your purchase or delivery location.
        </p>
      </PolicySection>

      <PolicySection title="6. Intellectual Property">
        <p>
          All content on the Site — including text, images, videos, course materials, logos, and branding — is owned by Wisdom Peters or its licensors and protected by copyright and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, or create derivative works from Site content without prior written permission.
        </p>
      </PolicySection>

      <PolicySection title="7. Coaching & Third-Party Services">
        <p>
          Enquiries for coaching, speaking, consulting, and mentorship arranged through the Site are subject to separate agreements. Bookstore purchases do not automatically include private coaching or live sessions unless explicitly stated.
        </p>
      </PolicySection>

      <PolicySection title="8. Disclaimer">
        <p>
          Content provided on the Site, including books and courses, is for educational and informational purposes. It does not constitute professional medical, legal, financial, or psychological advice. You should seek appropriate professional guidance for your specific circumstances.
        </p>
        <p>
          The Site is provided "as is" without warranties of any kind, to the fullest extent permitted by law.
        </p>
      </PolicySection>

      <PolicySection title="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Wisdom Peters shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or purchase of products.
        </p>
        <p>
          Our total liability for any claim relating to a purchase shall not exceed the amount you paid for the relevant product.
        </p>
      </PolicySection>

      <PolicySection title="10. Governing Law">
        <p>
          These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales, unless mandatory consumer protection laws in your country provide otherwise.
        </p>
      </PolicySection>

      <PolicySection title="11. Changes to Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms. Material changes will be indicated by updating the "Last updated" date on this page.
        </p>
      </PolicySection>

      <PolicySection title="12. Contact">
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>{" "}
          or visit our{" "}
          <Link to="/contact" className="text-purple-600 hover:underline">
            Contact page
          </Link>
          .
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
