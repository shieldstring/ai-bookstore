import React from "react";
import { Link } from "react-router-dom";
import LegalPageLayout, { PolicySection } from "../components/common/LegalPageLayout";

export default function RefundPage() {
  return (
    <LegalPageLayout
      seoTitle="Refund Policy | Wisdom Peters"
      seoDescription="Refund and return policy for books, courses, and digital products purchased from Wisdom Peters."
      eyebrow="Legal"
      title="Refund Policy"
      subtitle="Our commitment to your satisfaction, including our 30-day guarantee on eligible purchases."
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Refund Policy" },
      ]}
    >
      <PolicySection title="1. Overview">
        <p>
          At Wisdom Peters, we want you to be satisfied with your purchase. This Refund Policy explains when refunds are available for books, e-books, and online courses bought through our website.
        </p>
        <p>
          This policy is in addition to your statutory rights as a consumer under UK law, which are not affected.
        </p>
      </PolicySection>

      <PolicySection title="2. 30-Day Money-Back Guarantee">
        <p>
          Eligible digital courses and physical books purchased directly from our Site may be refunded within <strong>30 days</strong> of the purchase date, provided the conditions below are met.
        </p>
      </PolicySection>

      <PolicySection title="3. Digital Courses">
        <p>Course refunds may be granted within 30 days if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You have completed less than 25% of the course content</li>
          <li>You have not downloaded or received certificates or bonus materials designated as non-refundable</li>
          <li>The request is made in good faith due to technical issues we cannot resolve, or the course did not match its published description</li>
        </ul>
        <p>
          Refunds will not be issued if substantial course content has been accessed, shared, or downloaded beyond reasonable preview use.
        </p>
      </PolicySection>

      <PolicySection title="4. E-Books & Digital Downloads">
        <p>
          Due to the nature of digital products, e-book refunds are generally not available once the file has been downloaded or accessed, unless the product is defective or not as described. Contact us if you experience technical issues preventing access.
        </p>
      </PolicySection>

      <PolicySection title="5. Physical Books">
        <p>Physical book returns may be accepted within 30 days if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The book is in its original, resalable condition (undamaged, unmarked, with packaging intact where applicable)</li>
          <li>You provide proof of purchase (order number or receipt)</li>
          <li>The return is not excluded below</li>
        </ul>
        <p>
          Return shipping costs for change-of-mind returns are the customer's responsibility unless the item was faulty or incorrectly supplied.
        </p>
      </PolicySection>

      <PolicySection title="6. Non-Refundable Items">
        <p>The following are generally not eligible for refunds:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Coaching sessions, speaking engagements, and consulting services (subject to separate agreements)</li>
          <li>Products purchased through third-party platforms</li>
          <li>Gift cards or promotional credits</li>
          <li>Items marked as final sale at the time of purchase</li>
          <li>Digital products where substantial access or download has occurred</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Faulty or Incorrect Items">
        <p>
          If you receive a damaged, defective, or incorrect item, contact us within 14 days of delivery. We will arrange a replacement or full refund, including reasonable return shipping costs where applicable.
        </p>
      </PolicySection>

      <PolicySection title="8. How to Request a Refund">
        <p>To request a refund, email{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>{" "}
          with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your full name and account email</li>
          <li>Order number and purchase date</li>
          <li>Product name</li>
          <li>Reason for the refund request</li>
        </ul>
        <p>
          You may also use our{" "}
          <Link to="/contact" className="text-purple-600 hover:underline">
            Contact page
          </Link>
          . We aim to respond within 5 business days.
        </p>
      </PolicySection>

      <PolicySection title="9. Refund Processing">
        <p>
          Approved refunds are returned to your original PayPal payment method within 5–10 business days after approval. Processing times may vary depending on PayPal and your bank or card issuer.
        </p>
        <p>
          For physical returns, refunds are issued after we receive and inspect the returned item.
        </p>
      </PolicySection>

      <PolicySection title="10. Cancellations">
        <p>
          Orders for physical books may be cancelled before dispatch by contacting us promptly. Once an order has shipped, our standard return policy applies.
        </p>
      </PolicySection>

      <PolicySection title="11. Chargebacks">
        <p>
          If you have a concern about a charge, please contact us first so we can resolve the issue directly. Unauthorised chargebacks may result in account suspension pending investigation.
        </p>
      </PolicySection>

      <PolicySection title="12. Contact">
        <p>
          Refund enquiries:{" "}
          <a href="mailto:contact@wisdompeters.com" className="text-purple-600 hover:underline">
            contact@wisdompeters.com
          </a>
          {" "}| Phone:{" "}
          <a href="tel:+447518576657" className="text-purple-600 hover:underline">
            +44 7518 576657
          </a>
        </p>
      </PolicySection>
    </LegalPageLayout>
  );
}
