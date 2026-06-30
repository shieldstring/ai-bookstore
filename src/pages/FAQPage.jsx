import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import { ChevronDown, Mail, Phone } from "lucide-react";

const CONTACT_EMAIL = "contact@wisdompeters.com";
const CONTACT_PHONE = "+44 7518 576657";

const faqCategories = [
  {
    title: "Books & Courses",
    items: [
      {
        q: "What types of products do you sell?",
        a: "We offer physical books, e-books, and online video courses authored and curated by Wisdom Peters and selected partners. Courses include structured syllabi with lifetime digital access after purchase.",
      },
      {
        q: "How do I access a course after purchasing?",
        a: "Once your payment is confirmed, sign in to your account and go to Dashboard → My Courses. Your enrolled courses will appear there with full access to the video player and syllabus.",
      },
      {
        q: "Are e-books available for immediate download?",
        a: "Digital products are typically available immediately after purchase. You will receive access through your account dashboard or via email instructions depending on the product format.",
      },
      {
        q: "Can I preview a course before buying?",
        a: "Course detail pages include syllabus information, instructor details, and reviews. Contact us if you need further information before enrolling.",
      },
    ],
  },
  {
    title: "Orders & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit and debit cards through our secure Stripe checkout. All transactions are encrypted and processed securely.",
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes. After checkout you will receive an email confirmation and can view your order history under Dashboard → My Orders when signed in.",
      },
      {
        q: "Do you ship internationally?",
        a: "Physical books may be shipped to select regions. Shipping options and costs are calculated at checkout based on your delivery address.",
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        q: "Do I need an account to purchase?",
        a: "You can browse as a guest, but an account is required to complete checkout, access courses, and manage orders. Registration is free.",
      },
      {
        q: "How do I reset my password?",
        a: "Use the Forgot Password link on the sign-in page. You will receive an email with instructions to reset your password securely.",
      },
      {
        q: "How can I contact support?",
        a: "Reach us via the Contact page, email contact@wisdompeters.com, or call +44 7518 576657. We aim to respond within 1–2 business days.",
      },
    ],
  },
  {
    title: "Coaching & Services",
    items: [
      {
        q: "Can I book Wisdom Peters for speaking or coaching?",
        a: "Yes. Visit our About page to see available services, then use the Contact page or click any service card to send an enquiry. Include your preferred dates and event details.",
      },
      {
        q: "Are coaching sessions purchased through the bookstore?",
        a: "Private coaching, VIP strategy sessions, and consulting are arranged directly after an initial enquiry. They are separate from book and course purchases on this site.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your refund policy?",
        a: "We offer a 30-day money-back guarantee on eligible digital courses and physical books in accordance with our Refund Policy. See the full policy for conditions and how to request a refund.",
      },
      {
        q: "How do I request a refund?",
        a: "Email contact@wisdompeters.com with your order number, purchase date, and reason for the request. Our team will review and respond within 5 business days.",
      },
    ],
  },
];

const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-purple-50/50 transition"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-slate-800 text-sm md:text-base">{question}</span>
      <ChevronDown
        className={`h-5 w-5 text-purple-600 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="px-5 pb-4 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-3">
        {answer}
      </div>
    )}
  </div>
);

export default function FAQPage() {
  const [openKey, setOpenKey] = useState("0-0");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggle = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="FAQ | Wisdom Peters Bookstore"
        description="Frequently asked questions about books, courses, orders, refunds, and coaching services."
        name="Wisdom Peters"
        type="website"
      />

      <PageHero
        eyebrow="Help Centre"
        title="FAQ"
        subtitle="Answers to common questions about books, courses, orders, and services."
        align="left"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "FAQ" },
        ]}
      />

      <div className="container mx-auto px-4 max-w-3xl py-12 -mt-2 relative z-10 space-y-10">
        {faqCategories.map((category, catIdx) => (
          <section key={category.title}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-4">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                return (
                  <FaqItem
                    key={key}
                    question={item.q}
                    answer={item.a}
                    isOpen={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <div className="bg-purple-900 rounded-2xl p-6 md:p-8 text-white">
          <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
          <p className="text-purple-200 text-sm mb-5">
            Our team is happy to help with orders, courses, coaching enquiries, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold text-sm rounded-lg hover:bg-[#e8c547] transition"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </Link>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition"
            >
              <Phone className="h-4 w-4" />
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
