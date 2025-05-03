import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const BookRecommendations = ({ books }) => {
  return (
    <div className="space-y-4">
      {books.slice(0, 5).map((book) => (
        <div
          key={book.id}
          className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors "
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
      <Link
        to={`/dashboard/recommendations`}
        className="w-full mt-2 text-sm font-medium text-purple-600 hover:text-purple-700 text-center"
      >
        View all recommendations
      </Link>
    </div>
  );
};

export default BookRecommendations;
