import React, { useEffect, useMemo, useState } from "react";
import { useGetBooksQuery } from "../../redux/slices/bookSlice";
import LoadingSkeleton from "../preloader/LoadingSkeleton";

import ErrorMessage from "../common/ErrorMessage";
import { useNavigate } from "react-router-dom";

export default function TrendingBooks() {
  const [allBooks, setAllBooks] = useState([]);
  const { data, isLoading, isError } = useGetBooksQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setAllBooks(data);
    }
  }, [data]);

  // Only runs once on mount/reload
  const trendingBooks = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * allBooks.length);
    const randomBook = { ...allBooks[randomIndex], large: true };

    const remaining = allBooks.filter((_, i) => i !== randomIndex);
    return [randomBook, ...remaining];
  }, [allBooks]);

  // Show error state
  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <section className="text-center py-10 px-5">
      <h2 className="text-2xl md:text-3xl font-semibold">
        Trending Reads This Week
      </h2>
      <p className="text-gray-500 max-w-lg mx-auto mt-2">
        See what fellow book lovers are adding to their carts! Explore our most
        popular titles this week and discover your next captivating read. Don't
        miss out on these trending page-turners.
      </p>

      {isLoading ? (
        <div className="lg:px-28">
          <LoadingSkeleton type={"card"} count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8 lg:px-28 mx-auto">
          {trendingBooks.slice(0, 7).map((book, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                book.large ? "md:col-span-2 row-span-2" : ""
              }`}
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold">{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
