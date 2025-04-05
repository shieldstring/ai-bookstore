import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      name: "Arts & Photography",
      itemCount: "92+ item",
      imageUrl: "https://placehold.co/400x300/E07A5F/fff?text=Arts",
    },
    {
      name: "Biographies & Memoirs",
      itemCount: "124+ item",
      imageUrl: "https://placehold.co/400x300/81B29A/fff?text=Bio",
    },
    {
      name: "Children's Book",
      itemCount: "432+ item",
      imageUrl: "https://placehold.co/400x300/F2CC8F/fff?text=Kids",
    },
    {
      name: "Cookbook",
      itemCount: "23+ item",
      imageUrl: "https://placehold.co/400x300/3D405B/fff?text=Cook",
    },
    {
      name: "History",
      itemCount: "56+ item",
      imageUrl: "https://placehold.co/400x300/E07A5F/fff?text=Hist",
    },
    {
      name: "Literature",
      itemCount: "78+ item",
      imageUrl: "https://placehold.co/400x300/81B29A/fff?text=Lit",
    },
    {
      name: "Science Fiction",
      itemCount: "99+ item",
      imageUrl: "https://placehold.co/400x300/E9C46A/fff?text=SciFi",
    },
    {
      name: "Mystery",
      itemCount: "67+ item",
      imageUrl: "https://placehold.co/400x300/F4A261/fff?text=Mystery",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const itemsPerPage = 4.5;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      const maxIndex = Math.ceil(categories.length / itemsPerPage) - 1;
      return Math.min(newIndex, maxIndex);
    });
  }, [categories.length, itemsPerPage]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [itemsPerPage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const maxScrollIndex = Math.ceil(categories.length / itemsPerPage) - 1;
      if (currentIndex < maxScrollIndex) {
        nextSlide();
      } else {
        setCurrentIndex(0);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlide, currentIndex, categories.length, itemsPerPage]);

  const getDisplayCategories = () => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const currentPage = currentIndex;

    let start = Math.floor(currentPage * itemsPerPage);
    let end = Math.ceil((currentPage + 1) * itemsPerPage);

    if (end > categories.length) {
      const missing = end - categories.length;
      start = Math.max(0, start - missing);
      end = categories.length;
    }
    return categories.slice(start, end);
  };

  const displayCategories = getDisplayCategories();
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
          <div className="flex">
            {generatePageNumbers().map((pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentIndex(pageIndex)}
                className={`w-6 h-1 rounded-full mx-1 ${
                  currentIndex === pageIndex
                    ? "bg-blue-500"
                    : "bg-gray-300 hover:bg-gray-400"
                } transition-colors duration-200`}
                aria-label={`Go to page ${pageIndex + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden" ref={containerRef}>
          <div
            className="flex gap-3 transition-transform duration-500"
            style={{
              transform: `translateX(-${
                currentIndex *
                (containerWidth / itemsPerPage || 320 / itemsPerPage)
              }px)`,
              width: `${Math.ceil(categories.length / itemsPerPage) * 100}vw`,
            }}
          >
            {displayCategories.map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0  w-full"
                style={{
                  width: `${100 / itemsPerPage}vw`,
                }}
              >
                <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <div
                    className="relative"
                    style={{
                      backgroundImage: `url(${category.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      paddingTop: "45%",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"
                      style={{ backgroundColor: "rgba(91, 6, 125, 0.7)" }} //rgba(91, 6, 125, 0.6) with 80% opacity
                    >
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-sm">{category.itemCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button
              onClick={prevSlide}
              className={`bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors duration-200 ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous Slide"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors duration-200 ${
                currentIndex >= Math.ceil(categories.length / itemsPerPage) - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Next Slide"
              disabled={
                currentIndex >= Math.ceil(categories.length / itemsPerPage) - 1
              }
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
