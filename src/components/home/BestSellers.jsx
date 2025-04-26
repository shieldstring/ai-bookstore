import React, { useRef, useEffect, useState } from "react";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetBooksQuery } from "../../redux/slices/bookSlice";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSkeleton from "../preloader/LoadingSkeleton";

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const { data, isLoading, isError } = useGetBooksQuery();

  useEffect(() => {
    if (data) {
      setBestSellers(data.books);
    }
  }, [data]);

  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const offset = 250;

      let newScrollLeft =
        direction === "left" ? scrollLeft - offset : scrollLeft + offset;

      // Loop back to start when reaching the end
      if (newScrollLeft + clientWidth >= scrollWidth) {
        newScrollLeft = 0;
      }

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      scroll("right");
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Show error state
  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <section className="py-10 px-5 lg:px-24 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Best Sellers</h2>
        <button className="text-pink-500 flex items-center gap-1 text-sm font-medium">
          View more <ArrowRight size={18} />
        </button>
      </div>

      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-pink-500 z-10"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Books List */}
        {isLoading ? (
          <div className="lg:px-28">
            <LoadingSkeleton type={"card"} count={4} />
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-10 px-10 "
          >
            {bestSellers.map((book, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-white shadow-lg rounded-lg overflow-hidden relative"
              >
                {/* Book Cover */}
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-56 object-cover"
                  />
                </div>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-pink-200 text-pink-600 text-xs px-2 py-1 rounded">
                  {book.category}
                </span>

                {/* Book Details */}
                <div className="p-4">
                  <Link to={`books/${book._id}`} className="text-lg font-bold">
                    {book.title}
                  </Link>
                  <p className="text-gray-500 text-sm">{book.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
                    <Star size={14} fill="currentColor" stroke="none" />
                    {book.rating}
                  </div>

                  {/* Price */}
                  <div className="mt-2 text-lg font-bold text-pink-500 flex gap-2">
                    {book.price}
                    {book.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {book.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-pink-500 z-10"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
