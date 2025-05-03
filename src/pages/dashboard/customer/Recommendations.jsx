import React, { useEffect, useState } from "react";
import { useGetBooksQuery } from "../../../redux/slices/bookSlice";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/SEO";

function Recommendations() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const [books, setBooks] = useState([]);
  const { data, isLoading, isError } = useGetBooksQuery();

  useEffect(() => {
    if (data?.books) {
      setBooks(data.books);
    }
  }, [data]);

  // Show error state
  if (isError) {
    return <ErrorMessage />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="lg:px-28">
        <LoadingSkeleton type={"list"} count={2} />
      </div>
    );
  }
  return (
    <div>
      <SEO
        title="Recommendations"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 ">Recommendations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 py-5">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors shadow "
            >
              <img
                src={book.image}
                alt={book.title}
                className="h-16 w-12 object-cover rounded shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-500">{book.author}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < book.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({book.reviewCount})
                  </span>
                </div>
              </div>
              <Link
                to={`/books/${book._id}`}
                className="text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
