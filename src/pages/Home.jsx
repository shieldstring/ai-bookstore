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

const Home = () => {
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

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default Home;
