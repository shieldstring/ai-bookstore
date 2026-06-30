import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "react-toastify";

const CONTACT_PHONE = "+44 7518 576657";
const CONTACT_EMAIL = "contact@wisdompeters.com";
const CONTACT_LOCATION = "Manchester, United Kingdom";

const interestOptions = [
  { value: "", label: "Select a topic (optional)" },
  { value: "coaching", label: "Private Coaching & VIP Strategy" },
  { value: "wellness", label: "Faith-Based Mental Wellness" },
  { value: "leadership", label: "Leadership & Ministry Development" },
  { value: "mastermind", label: "Business Masterminds" },
  { value: "mentorship", label: "Custom Mentorship Tracks" },
  { value: "consulting", label: "High-Level Consulting" },
  { value: "speaking", label: "Speaking Engagements" },
  { value: "executive", label: "Executive Coaching & Life Mastery" },
  { value: "other", label: "Other Enquiry" },
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    interest: searchParams.get("interest") || "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const interest = searchParams.get("interest");
    if (interest) {
      setForm((prev) => ({ ...prev, interest }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.surname.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your first name, surname, email, and message.");
      return;
    }

    setSubmitting(true);

    const fullName = `${form.firstName.trim()} ${form.surname.trim()}`;
    const subject = encodeURIComponent(
      `Enquiry from ${fullName}${form.interest ? ` — ${form.interest}` : ""}`
    );
    const body = encodeURIComponent(
      `First Name: ${form.firstName}\nSurname: ${form.surname}\nEmail: ${form.email}\nPhone: ${form.phone || "Not provided"}\nInterest: ${form.interest || "General"}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    toast.success("Opening your email client to send your message.");
    setSubmitting(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Contact Wisdom Peters"
        description="Get in touch with Wisdom Peters for coaching, speaking, consulting, and mentorship enquiries."
        name="Wisdom Peters"
        type="website"
      />

      <PageHero
        eyebrow="Let's Connect"
        title="Contact Us"
        subtitle="Whether you're a visionary, executive, leader, or seeker of transformation — we'd love to hear from you."
        backgroundImage="/pl 4.jpeg"
        overlayClass="bg-gradient-to-br from-purple-950/88 via-black/80 to-black/90"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="container mx-auto px-4 py-16 max-w-6xl -mt-4 relative z-20">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Contact Information</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-purple-50 rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
                    <a
                      href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                      className="text-slate-800 font-medium hover:text-purple-600 transition"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-purple-50 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-slate-800 font-medium hover:text-purple-600 transition break-all"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-purple-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-slate-800 font-medium">{CONTACT_LOCATION}</p>
                  </div>
                </li>
              </ul>
            </div>

            <blockquote className="border-l-4 border-purple-400 pl-5 py-2 italic text-slate-600 text-sm leading-relaxed">
              "Purpose is not an idea, it's an assignment. Let's work together to birth yours."
              <footer className="mt-2 not-italic font-semibold text-purple-700">— Wisdom Peters</footer>
            </blockquote>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5"
            >
              <h2 className="text-lg font-bold text-slate-800">Send a Message</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-slate-700 mb-1">
                    Surname *
                  </label>
                  <input
                    id="surname"
                    name="surname"
                    type="text"
                    required
                    value={form.surname}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Surname"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+44 7XXX XXX XXX"
                  />
                  <p className="text-xs text-slate-400 mt-1">Leave your number if you'd like us to call you back.</p>
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-slate-700 mb-1">
                    Area of Interest
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
