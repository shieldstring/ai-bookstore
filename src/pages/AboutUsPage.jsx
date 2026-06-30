import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Heart,
  Mic2,
  Sparkles,
  Target,
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
  {
    title: "Private Coaching & VIP Strategy Sessions",
    description: "One-on-one guidance tailored to your goals, vision, and next level of impact.",
    icon: Sparkles,
    interest: "coaching",
  },
  {
    title: "Faith-Based Mental Wellness & Emotional Intelligence Programs",
    description: "Holistic programs blending faith, psychology, and practical emotional mastery.",
    icon: Heart,
    interest: "wellness",
  },
  {
    title: "Leadership & Ministry Development Courses",
    description: "Structured training to equip leaders and ministers for greater effectiveness.",
    icon: Users,
    interest: "leadership",
  },
  {
    title: "Business Masterminds for Faith-Driven Entrepreneurs",
    description: "Collaborative sessions for founders building purpose-aligned, profitable ventures.",
    icon: Briefcase,
    interest: "mastermind",
  },
  {
    title: "Custom Mentorship Tracks (Ministers, Coaches, CEOs)",
    description: "Bespoke mentorship pathways designed for your unique calling and context.",
    icon: Target,
    interest: "mentorship",
  },
  {
    title: "High-Level Consulting for Visionaries & Organizations",
    description: "Strategic advisory for organizations navigating growth, transition, and vision.",
    icon: BookOpen,
    interest: "consulting",
  },
];

const bookingOptions = [
  { label: "Executive Coaching & Life Mastery", icon: Sparkles, interest: "executive" },
  { label: "Church & Marketplace Leadership Training", icon: Users, interest: "leadership" },
  { label: "Speaking Engagements & Conferences", icon: Mic2, interest: "speaking" },
  { label: "Business Strategy Consulting", icon: Briefcase, interest: "consulting" },
  { label: "Mentoring Programs for High Achievers", icon: BookOpen, interest: "mentorship" },
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

      <PageHero
        variant="featured"
        eyebrow="About Us"
        title="Wisdom Peters"
        subtitle={roles.join(" · ")}
        align="left"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About" },
        ]}
        aside={
          <div className="relative art-hero-float">
            <div className="absolute -inset-4 border border-[#D4AF37]/30 rounded-2xl rotate-3" aria-hidden="true" />
            <div className="absolute -inset-4 border border-purple-500/20 rounded-2xl -rotate-2" aria-hidden="true" />
            <img
              src="/pl 3.jpeg"
              alt="Wisdom Peters — Bible teacher, pastor, and life strategist"
              className="relative w-64 md:w-80 lg:w-96 rounded-2xl shadow-2xl object-cover aspect-[3/4] ring-2 ring-[#D4AF37]/40"
            />
          </div>
        }
      />

      {/* Bio */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* What He Offers — standalone clickable cards */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 text-center">
            What He Offers
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto text-sm">
            Tap any service below to enquire directly.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map(({ title, description, icon: Icon, interest }) => (
              <Link
                key={interest}
                to={`/contact?interest=${interest}`}
                className="group block bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-xl transition-colors">
                    <Icon className="h-6 w-6 text-purple-700" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 group-hover:text-purple-800 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Book For — standalone clickable cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 text-center">
            Book Wisdom Peters For
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto text-sm">
            Select an option to start your booking enquiry.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookingOptions.map(({ label, icon: Icon, interest }) => (
              <Link
                key={interest}
                to={`/contact?interest=${interest}`}
                className="group flex flex-col bg-white hover:bg-purple-900 border border-slate-200 hover:border-purple-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Icon className="h-7 w-7 text-purple-600 group-hover:text-[#D4AF37] mb-4 transition-colors" />
                <h3 className="font-bold text-slate-800 group-hover:text-white mb-2 transition-colors flex-1">
                  {label}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 group-hover:text-[#D4AF37] transition-colors">
                  Enquire now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
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
