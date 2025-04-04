import React, { useRef } from "react";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";

const bestSellers = [
  {
    title: "So You Want To Talk About Race",
    author: "Ijeoma Oluo",
    img: "/images/book1.jpg",
    category: "Biography",
    rating: 4.5,
    price: "$15.63",
    oldPrice: "$19.99",
  },
  {
    title: "Life of Wilds",
    author: "Jasmine Bello",
    img: "/images/book2.jpg",
    category: "Nature",
    rating: 3.5,
    price: "$24.99",
  },
  {
    title: "Story of Everest",
    author: "Henry Martopo",
    img: "/images/book3.jpg",
    category: "Adventure",
    rating: 4.7,
    price: "$21.99",
    oldPrice: "$25",
  },
];

export default function BestSellers() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const offset = 250;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - offset : scrollLeft + offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 px-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold">Best Sellers</h2>
        <button className="text-pink-500 flex items-center gap-1 text-sm font-medium">
          View more <ArrowRight size={18} />
        </button>
      </div>

      <div className="relative mt-6">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-pink-500"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Books List */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
        >
          {bestSellers.map((book, index) => (
            <div
              key={index}
              className="min-w-[220px] md:min-w-[250px] bg-white shadow-lg rounded-lg overflow-hidden relative"
            >
              {/* Book Cover */}
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-56 object-cover"
              />

              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-pink-200 text-pink-600 text-xs px-2 py-1 rounded">
                {book.category}
              </span>

              {/* Book Details */}
              <div className="p-3">
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-gray-500 text-sm">{book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
                  <Star size={14} fill="currentColor" stroke="none" /> {book.rating}
                </div>

                {/* Price */}
                <div className="mt-2 text-lg font-bold text-pink-500 flex gap-2">
                  {book.price}
                  {book.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {book.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-pink-500"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
