import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendedBooks = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [direction, setDirection] = useState(0);

  const books = [
    {
      id: 0,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, velit nemo adipisicing elit.",
      price: 17.50,
      originalPrice: 26.99,
      image: "https://placehold.co/400x300/81B29A/fff?text=Lit",
      category: "Thriller",
      rating: 4.3
    },
    {
      id: 1,
      title: "Emily and the Backbone",
      author: "A.G. Riddle",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, velit nemo elit in at nemo.",
      price: 19.23,
      originalPrice: 29.99,
      image: "https://placehold.co/400x300/81B29A/fff?text=Lit",
      category: "Romance",
      rating: 4.7
    },
    {
      id: 2,
      title: "So you want to talk about race?",
      author: "Ijeoma Oluo",
      description: "So you want to talk about race? Lorem ipsum dolor...",
      price: 18.99,
      originalPrice: 24.99,
      image: "https://placehold.co/400x300/81B29A/fff?text=Lit",
      category: "Non-fiction",
      rating: 4.2
    },
    {
      id: 3,
      title: "The Dutch House",
      author: "Ann Patchett",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: 16.75,
      originalPrice: 22.99,
      image: "https://placehold.co/400x300/81B29A/fff?text=Lit",
      category: "Fiction",
      rating: 4.5
    }
  ];

  const handlePrevious = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex === books.length - 1 ? 0 : prevIndex + 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: 'absolute',
    }),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const prevBook = books[(activeIndex - 1 + books.length) % books.length];
  const currentBook = books[activeIndex];
  const nextBook = books[(activeIndex + 1) % books.length];

  return (
    <div className="lg:px-24 mx-auto px-4 py-8 lg:py-16 bg-white">
      <div className="flex justify-between items-center mb-6 lg:mb-10">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Recommended Books</h2>
        <button className="text-purple-500 text-sm font-medium flex items-center">
          View more <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between md:space-x-4">
          {/* Left (Previous) Book Card */}
          <div className="hidden lg:block w-1/3 bg-gray-50 rounded-lg p-5 relative opacity-50 transition-opacity duration-300">
            <div className="flex items-start mb-1">
              <div className="text-amber-400 text-xs">{'★'.repeat(Math.floor(prevBook.rating))}</div>
              <div className="text-gray-400 text-xs ml-1">{prevBook.rating} Reviews</div>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">{prevBook.title}</h3>
            <p className="text-gray-500 text-xs mb-12">{prevBook.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-bold">${prevBook.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Center (Active) Book Card */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentBook.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.1 }}
              className="w-full lg:w-2/3 rounded-lg overflow-hidden shadow-lg z-10 transition-all duration-300 transform scale-105"
            >
              <div className="relative flex">
                {/* Book Cover Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={currentBook.image}
                    alt={currentBook.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-100 text-pink-500 px-2 py-1 rounded-md text-xs">
                    {currentBook.category}
                  </div>
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-start mb-1">
                    <div className="text-amber-400 text-xs">{'★'.repeat(Math.floor(currentBook.rating))}</div>
                    <div className="text-gray-400 text-xs ml-1">{currentBook.rating} Reviews</div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{currentBook.title}</h3>
                  <p className="text-gray-500 text-xs mb-12">{currentBook.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-purple-600 font-bold">${currentBook.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through text-sm">${currentBook.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-purple-600 text-white flex-1 py-2 rounded-md flex items-center justify-center text-sm">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to cart
                    </button>
                    {/* <button className="w-10 h-10 border border-red-100 rounded-md flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right (Next) Book Card */}
          <div className="hidden lg:block w-1/3 bg-gray-50 rounded-lg p-5 relative opacity-50 transition-opacity duration-300">
            <div className="flex items-start mb-1">
              <div className="text-amber-400 text-xs">{'★'.repeat(Math.floor(nextBook.rating))}</div>
              <div className="text-gray-400 text-xs ml-1">{nextBook.rating} Reviews</div>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">{nextBook.title}</h3>
            <p className="text-gray-500 text-xs mb-12">{nextBook.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-bold">${nextBook.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-20"
          aria-label="Previous book"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-20"
          aria-label="Next book"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default RecommendedBooks;
