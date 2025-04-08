import React, { useEffect } from "react";
import SEO from "../components/SEO";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";
import LatestNews from "../components/home/LatestNews";
import TrendingBooks from "../components/home/TrendingBooks";
import BestSellers from "../components/home/BestSellers";
import CategoriesSection from "../components/home/CategoriesSection";
import TopRated from "../components/home/TopRated";
import RecommendedBooks from "../components/home/RecommendedBooks";
import HeroBanner from "../components/home/HeroBanner";
import Testimonials from "../components/common/Testimonials";
import Stats from "../components/common/Stats";

const Home = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>
      <SEO
        title="AI-Powered Social-Ecommerce | Home"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />

      {/* Hero Section */}
      <HeroBanner />

      {/* Trending Books */}
      <TrendingBooks />

      <div className="my-16 px-2 lg:px-24">
          <h2 className="text-3xl font-bold text-center mb-8">Join Our Reading Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Connect with Readers</h3>
              <p>Join discussions, share reviews, and connect with like-minded readers in our groups.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p>Participate in our MLM program and earn rewards for your reading and referrals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
              <p>Our AI-powered system recommends books tailored to your preferences.</p>
            </div>
          </div>
        </div>

      {/* Features */}
      <ValueProps />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Categories */}
      <CategoriesSection />

      {/* Top Rated */}
      <TopRated />

      {/* FeaturedBooks */}
      <RecommendedBooks />

      {/* Latest News */}
      <LatestNews />

      {/* Testimonial */}
      <Testimonials />

      {/* Statistics */}
      <Stats />
      {/* Newsletter Section */}
      
      <Newsletter />
    </div>
  );
};

export default Home;
