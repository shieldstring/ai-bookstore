import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Mic2,
  Sparkles,
  Users,
} from "lucide-react";

const roles = [
  "Bible Teacher",
  "Pastor",
  "Psychology Coach",
  "Life Strategist",
  "Business Mentor",
  "Author",
];

const bioParagraphs = [
  "Wisdom Peters is a dynamic and multifaceted thought leader whose influence spans across ministry, psychology, leadership, business, and human transformation. With over two decades of experience, he has empowered countless individuals and organizations across different endeavors through teachings, mentorship, and strategic consultations.",
  "As a Bible teacher and pastor, Wisdom carries a prophetic and pastoral mandate to rightly divide the Word of truth and raise individuals who are spiritually grounded, emotionally whole, and purpose driven. His teachings blend deep theological insight with psychological and practical relevance helping audiences not only experience spiritual growth but also transform every area of their lives.",
  "In his role as a life coach and psychology mentor, Wisdom brings cutting edge insights into human behavior, decision making, and emotional intelligence. With certifications and a passion for mental health and mindset mastery, he works closely with professionals, creatives, entrepreneurs, and ministers to help them overcome internal limitations, achieve clarity, and live with intentionality.",
  "As a business strategist, he mentors founders, executives, and startup teams to develop scalable models, ethical leadership, and purpose aligned profitability. Through private VIP consultations, mastermind groups, and bespoke business advisory programs, he has helped clients birth new ventures, reposition their brands, and navigate complex leadership transitions.",
  "A prolific writer and speaker, Wisdom Peters is the author of multiple transformational books and is regularly featured in conferences, leadership summits, and spiritual retreats. His teachings cut across spiritual intelligence, mental wellness, high performance habits, kingdom economics, and holistic success.",
  "Whether you're a C-suite executive, ministry leader, startup founder, or someone on the edge of breakthrough, Wisdom's unique blend of prophetic clarity, psychological depth, and strategic precision will challenge and equip you to rise higher.",
];

const offerings = [
  "Private Coaching & VIP Strategy Sessions",
  "Faith-Based Mental Wellness & Emotional Intelligence Programs",
  "Leadership & Ministry Development Courses",
  "Business Masterminds for Faith-Driven Entrepreneurs",
  "Custom Mentorship Tracks (Ministers, Coaches, CEOs)",
  "High-Level Consulting for Visionaries & Organizations",
];

const bookingOptions = [
  { label: "Executive Coaching & Life Mastery", icon: Sparkles },
  { label: "Church & Marketplace Leadership Training", icon: Users },
  { label: "Speaking Engagements & Conferences", icon: Mic2 },
  { label: "Business Strategy Consulting", icon: Briefcase },
  { label: "Mentoring Programs for High Achievers", icon: BookOpen },
];

export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="About Wisdom Peters | Bookstore"
        description="Meet Wisdom Peters — Bible teacher, pastor, psychology coach, life strategist, business mentor, and author empowering leaders worldwide."
        name="Wisdom Peters"
        image="/pl%203.jpeg"
        type="website"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-3">
                About Us
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Wisdom Peters
              </h1>
              <p className="text-purple-100 text-base md:text-lg leading-relaxed mb-8">
                {roles.join(" | ")}
              </p>
              <blockquote className="border-l-4 border-purple-300 pl-4 italic text-purple-100 text-lg">
                "Purpose is not an idea, it's an assignment. Let's work together
                to birth yours."
              </blockquote>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-3 bg-purple-400/20 rounded-2xl blur-xl" />
                <img
                  src="/pl 3.jpeg"
                  alt="Wisdom Peters — Bible teacher, pastor, and life strategist"
                  className="relative w-72 md:w-80 lg:w-96 rounded-2xl shadow-2xl object-cover aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* What He Offers & Book For */}
      <section className="bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                What He Offers
              </h2>
              <ul className="space-y-4">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                Book Wisdom Peters For
              </h2>
              <ul className="space-y-4">
                {bookingOptions.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Let's Connect
        </h2>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          If you're a visionary, executive, leader, or seeker of personal and
          professional transformation, you're in the right place. Partner with
          Wisdom Peters to unlock your full potential spiritually, mentally, and
          strategically.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/books"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
          >
            Explore Books & Courses
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-md hover:bg-purple-50 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
