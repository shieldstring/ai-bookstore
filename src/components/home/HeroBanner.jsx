import { useState, useEffect } from 'react';
import {
  ShoppingCart,
} from "lucide-react";

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const books = [
    {
      title: "Be your self & Never Surrender",
      image: "https://placehold.co/400x300/81B29E/fff?text=Surrender",
      color: "bg-orange-500"
    },
    {
      title: "THEORY: Is Alien Real",
      image: "https://placehold.co/400x300/81B29A/fff?text=THEORY",
      color: "bg-orange-500"
    },
    {
      title: "So you want to be a writer",
      image: "https://placehold.co/400x300/81B29C/fff?text=You",
      color: "bg-orange-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % books.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <section className="bg-purple-800 text-white py-12 lg:py-16">
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
                src={books[activeSlide].image}
                alt={books[activeSlide].title}
                className="rounded-lg shadow-lg relative z-10"
              />
              <div className="absolute -left-16 -bottom-4 z-0">
                <img
                  src={books[(activeSlide + 1) % books.length].image}
                  alt={books[(activeSlide + 1) % books.length].title}
                  className="rounded-lg shadow-lg transform -rotate-6"
                />
              </div>
              <div className="absolute -right-16 -bottom-4 z-0">
                <img
                  src={books[(activeSlide + 2) % books.length].image}
                  alt={books[(activeSlide + 2) % books.length].title}
                  className="rounded-lg shadow-lg transform rotate-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dots for slider */}
        <div className="flex justify-center mt-6">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full mx-2 ${activeSlide === index ? 'bg-white' : 'bg-gray-400'}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
