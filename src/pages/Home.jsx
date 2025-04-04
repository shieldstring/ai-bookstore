import React, { useEffect } from "react";
import SEO from "../components/SEO";
import Newsletter from "../components/common/Newsletter";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Filter,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import ValueProps from "../components/common/ValueProps";
import BestSellers from "../components/home/TopRated";
import LatestNews from "../components/home/LatestNews";
import TrendingBooks from "../components/home/TrendingBooks";

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
      <section className="bg-purple-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                Welcome to AI-Powered
                <br />
                Online Social Book Store
              </h1>
              <p className="text-purple-200 mb-6">
                Discover thousands of books across genres and formats. From
                bestsellers to indie gems, find your next great read with us.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-1.5">
                    <div className="bg-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      4
                    </div>
                  </div>
                  <span className="ml-2 text-sm">80.1k</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-1">
                    <ShoppingCart className="h-4 w-4 text-purple-800" />
                  </div>
                  <span className="ml-2 text-sm">25,534</span>
                </div>
              </div>

              <button className="bg-pink-600 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-pink-700 transition">
                Browse the Collection
              </button>
            </div>

            <div className="flex justify-center relative">
              <div className="relative">
                <img
                  src="/api/placeholder/170/250"
                  alt="Book Cover"
                  className="rounded-lg shadow-lg relative z-10"
                />
                <div className="absolute -left-16 -bottom-4 z-0">
                  <img
                    src="/api/placeholder/170/250"
                    alt="Book Cover"
                    className="rounded-lg shadow-lg transform -rotate-6"
                  />
                </div>
                <div className="absolute -right-16 -bottom-4 z-0">
                  <img
                    src="/api/placeholder/170/250"
                    alt="Book Cover"
                    className="rounded-lg shadow-lg transform rotate-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 

      {/* Trending Books */}
      <TrendingBooks />

           {/* Features */}
           <ValueProps />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Latest News */}
      <LatestNews />

      {/* Testimonial */}

      {/* Statistics */}

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default Home;
