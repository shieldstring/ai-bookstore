import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetBooksQuery } from "../../redux/slices/bookSlice";
import LoadingSkeleton from "../preloader/LoadingSkeleton";

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const { data, isLoading, isError, error } = useGetBooksQuery();

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  useEffect(() => {
    if (books && books.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % books.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [books]);

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  const handleBrowseClick = () => {
    navigate("/books");
  };

  // Show error state
  if (isError) {
    return (
      <section className="bg-purple-800 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Error Loading Books
          </h1>
          <p className="text-purple-200 mb-6">
            {error?.data?.message ||
              "Failed to load books. Please check your network connection."}
          </p>
          <button
            onClick={handleBrowseClick}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-pink-700 transition"
          >
            Browse Books
          </button>
        </div>
      </section>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <section className="bg-purple-800 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Loading...
              </h1>
              <p className="text-purple-200 mb-6">
                Please wait while we load our featured books.
              </p>
              <LoadingSkeleton />
            </div>
            <LoadingSkeleton type={"card"} count={3} />
          </div>
        </div>
      </section>
    );
  }

  // Show empty state or initial state.  Crucially, check if books is *defined*.
  if (!books || books.length === 0) {
    return (
      <section className="bg-purple-800 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {books === undefined ? "Loading..." : "No Books Available"}
          </h1>
          <p className="text-purple-200 mb-6">
            {books === undefined
              ? "Please wait while we load our featured books."
              : "We're adding new books to our collection. Check back soon!"}
          </p>
          <button
            onClick={handleBrowseClick}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-pink-700 transition"
          >
            Browse Books
          </button>
        </div>
      </section>
    );
  }

  // Render the banner with book data
  return (
    <section className="bg-purple-800 text-white py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Welcome to AI-Powered
              <br className="hidden lg:block" /> Online Social Book Store
            </h1>
            <p className="text-purple-200 mb-6">
              Discover thousands of books across genres and formats. From
              bestsellers to indie gems, find your next great read with us.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
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

            <button
              onClick={handleBrowseClick}
              className="bg-pink-600 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-pink-700 transition"
            >
              Browse Books
            </button>
          </div>
          <div className="flex justify-center relative mt-6 md:mt-0">
            <div className="relative w-full max-w-md">
              <img
                src={books[activeSlide].image}
                alt={books[activeSlide].title}
                className="rounded-lg shadow-lg relative z-10 sm:w-[20rem] h-[30rem] mx-auto"
              />
              {books.length > 1 && (
                <>
                  <div className="absolute -left-16 -bottom-4 z-0 hidden md:block">
                    <img
                      src={books[(activeSlide + 1) % books.length].image}
                      alt={books[(activeSlide + 1) % books.length].title}
                      className="rounded-lg shadow-lg transform -rotate-6 sm:w-[20rem] h-[30rem]"
                    />
                  </div>
                  <div className="absolute -right-16 -bottom-4 z-0 hidden md:block">
                    <img
                      src={books[(activeSlide + 2) % books.length].image}
                      alt={books[(activeSlide + 2) % books.length].title}
                      className="rounded-lg shadow-lg transform rotate-6 sm:w-[20rem] h-[30rem]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dots for slider - only show if there are multiple books */}
        {books.length > 1 && (
          <div className="flex justify-center pt-6">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full mx-2 ${
                  activeSlide === index ? "bg-white" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
