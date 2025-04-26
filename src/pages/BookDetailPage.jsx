import React, { useEffect, useState } from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";
import SEO from "../components/SEO";
import ReviewList from "../components/bookDetails/ReviewList";
import { Link, useParams } from "react-router-dom";
import ReviewForm from "../components/bookDetails/ReviewForm";
import {
  useAddReviewMutation,
  useGetBookDetailsQuery,
} from "../redux/slices/bookSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";
import FormattedDate from "../components/FormattedDate";
import { toast } from "react-toastify";
import { addToCartWithSync } from "../redux/slices/cartThunks";

function BookDetailPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [book, setBook] = useState([]);
  const { data, isLoading, isError, error } = useGetBookDetailsQuery(id);
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (data) {
      setBook(data);
    }
  }, [data]);

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 88 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  // Add to Cart
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(
        addToCartWithSync({
          bookId: id,
          quantity,
        })
      );
      // Show success message or notification
      toast.success("Sucessfully added Book Cart");
    } catch (err) {
      toast.error(err);
      console.log(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await addReview({
        bookId: id,
        rating,
        text: reviewText,
      }).unwrap();
      setRating(0);
      setReviewText("");
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

  if (isLoading)
    return (
      <div className="lg:px-24">
        <LoadingSkeleton type={"page"} />
      </div>
    );
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      <>
        <SEO
          title={`${book.title} by ${book.author}`}
          description={book.description}
          image={book.image}
        />
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-3 px-4 lg:px-24 mb-6">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-purple-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-purple-600">/</span>
            <Link to="/books" className="text-purple-600 hover:underline">
              Books
            </Link>
            <span className="mx-2 text-purple-600">/</span>
            <span className="text-gray-500">{book.title}</span>
          </div>
        </div>

        <div className="lg:px-24 mx-auto p-4 bg-white">
          {/* Product Overview Section */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Left Column - Images */}
            <div className="lg:w-1/3 flex flex-col md:flex-row gap-4">
              <div className="flex-1 rounded-lg overflow-hidden">
                <img
                  src={book.image}
                  alt="Book cover"
                  className="w-full h-[20rem] object-contain"
                />
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.floor(book.rating)
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      }
                      size={18}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{book.rating}</span>
                <span className="text-sm text-gray-600">
                  ({book.reviewCount} Reviews)
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-600 mb-6">by {book.author}</p>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">{book.description}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-purple-600 text-2xl font-bold">
                  ${book.price}
                </span>
                <span className="text-gray-400 line-through">
                  ${book.originalPrice}
                </span>
                <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded">
                  20% Off
                </span>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <span className="px-3 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className=" px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {isAdding ? (
                    <LoadingSpinner />
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart size={16} />
                      BUY
                    </span>
                  )}
                </button>

                {/* <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-100">
                  <Heart size={16} />
                </button> */}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              <button
                className={`py-3 font-medium ${
                  activeTab === "details"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-3 font-medium ${
                  activeTab === "reviews"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Customer Reviews ({book.reviewCount})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 text-white rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Book Title</h3>
                    <p>{book.title}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Author</h3>
                    <p>{book.author}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">ISBN</h3>
                    <p>{book.isbn || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Edition Language
                    </h3>
                    <p>{book.language}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Book Format</h3>
                    <p>{book.format}</p>
                  </div>
                  {book.publishDate && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Date Published
                      </h3>
                      <FormattedDate date={book?.publishDate} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Publisher</h3>
                    <p>{book.publisher}</p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center gap-4 mb-8  bg-[#FDF8FE] p-2 rounded-t-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{book.rating}</div>
                      <div className="text-sm text-gray-600">out of 5</div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < Math.floor(book.rating)
                                ? "text-orange-400 fill-orange-400"
                                : "text-gray-300"
                            }
                            size={16}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      {ratingDistribution.map((item) => (
                        <div
                          key={item.stars}
                          className="flex items-center gap-2 mb-1"
                        >
                          <div className="flex items-center gap-1 w-12">
                            <span>{item.stars}</span>
                            <Star
                              className="text-orange-400 fill-orange-400"
                              size={14}
                            />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-xs text-gray-600">
                            {item.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {userInfo ? (
                    <ReviewForm
                      rating={rating}
                      setRating={setRating}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      onSubmit={handleReviewSubmit}
                      user={userInfo || "9086"}
                    />
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <p className="text-blue-800">
                        Please{" "}
                        <Link
                          to="/login"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          sign in
                        </Link>{" "}
                        to leave a review.
                      </p>
                    </div>
                  )}

                  <ReviewList reviews={book.reviews} />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
      {/* Features */}
      <ValueProps />
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
export default BookDetailPage;
