import React, { useEffect, useState } from "react";
import { Star, ShoppingCart, Heart, Store, BookOpen } from "lucide-react";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
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
import { useGetSellerStorefrontQuery } from "../redux/slices/sellerApiSlice";
import useCurrency from "../hooks/useCurrency";
import { useGetEnrollmentQuery } from "../redux/slices/enrollmentApiSlice";

function BookDetailPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { currency, formatPlain } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [book, setBook] = useState([]);
  const { data, isLoading, isError, error } = useGetBookDetailsQuery({
    bookId: id,
    currency,
  });
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sellerData, setSellerData] = useState("");

  const { data: enrollmentData } = useGetEnrollmentQuery(id, {
    skip: !userInfo || book?.format !== "Course",
  });
  const isEnrolled = !!enrollmentData?.data;

  // Fetch seller information if book has a seller
  const { data: seller } = useGetSellerStorefrontQuery(
    book?.seller || book?.seller,
    {
      skip: !book?.seller && !book?.seller,
    }
  );

  useEffect(() => {
    if (data) {
      setBook(data.data);
    }
    if (seller) {
      setSellerData(seller.data.sellerProfile);
    }
  }, [data, seller]);


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
      toast.success("Successfully added Book to Cart");
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
      toast.success("Review submitted successfully");
    } catch (err) {
      console.error("Failed to add review:", err);
      toast.error(err?.data?.message || "Failed to submit review");
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
        <PageHero
          variant="compact"
          eyebrow={book.format === "Course" ? "Course" : "Book"}
          title={book.title}
          subtitle={`by ${book.author}`}
          backgroundImage={book.image}
          align="left"
          overlayClass="bg-gradient-to-r from-black/88 via-purple-950/82 to-black/75"
          minHeight="min-h-[240px] md:min-h-[280px]"
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Books", to: "/books" },
            { label: book.title?.length > 40 ? `${book.title.slice(0, 40)}…` : book.title },
          ]}
        />

        <div className="lg:px-24 mx-auto p-4 bg-white -mt-2 relative z-10">
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

              {/* Seller Information */}
              {(book?.seller || sellerData) && (
                <div className="mb-4">
                  <Link
                    to={`/seller/store/${
                      book.seller?.slug ||
                      sellerData?.slug ||
                      book.seller?._id ||
                      sellerData?._id
                    }`}
                    className="inline-flex items-center text-purple-600 hover:underline"
                  >
                    <Store className="w-4 h-4 mr-1" />
                    <span>
                      {book.seller?.storeName || sellerData?.storeName}
                    </span>
                  </Link>
                  {(book.seller?.rating || sellerData?.rating) && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <div className="flex mr-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i <
                              Math.floor(
                                book.seller?.rating || sellerData?.rating || 0
                              )
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                            size={14}
                          />
                        ))}
                      </div>
                      <span>
                        (
                        {book.seller?.reviewCount ||
                          sellerData?.reviewCount ||
                          0}{" "}
                        reviews)
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-600 mb-4">{book.description}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-purple-600 text-2xl font-bold">
                  {formatPlain(book.price, { priceIsConverted: true })}
                </span>
                {book.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through">
                      {formatPlain(book.originalPrice, { priceIsConverted: true })}
                    </span>
                    <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded">
                      {Math.round((1 - book.price / book.originalPrice) * 100)}%
                      Off
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-4 mb-6">
                {book.format !== "Course" && (
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
                )}

                {isEnrolled ? (
                  <Link
                    to={`/dashboard/courses/${id}`}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 font-semibold shadow-md flex items-center gap-2"
                  >
                    Go to Course Player
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors duration-200"
                  >
                    {isAdding ? (
                      <LoadingSpinner />
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart size={16} />
                        {book.format === "Course" ? "ENROLL NOW" : "BUY"}
                      </span>
                    )}
                  </button>
                )}
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
              {(book?.seller || sellerData) && (
                <button
                  className={`py-3 font-medium ${
                    activeTab === "seller"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("seller")}
                >
                  Seller Information
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 text-white rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">{book.format === "Course" ? "Course Title" : "Book Title"}</h3>
                      <p>{book.title}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{book.format === "Course" ? "Instructor" : "Author"}</h3>
                      <p>{book.author}</p>
                    </div>
                    {book.format !== "Course" && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">ISBN</h3>
                        <p>{book.isbn || "N/A"}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Edition Language</h3>
                      <p>{book.language}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{book.format === "Course" ? "Product Format" : "Book Format"}</h3>
                      <p>{book.format}</p>
                    </div>
                    {book.publishDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {book.format === "Course" ? "Release Date" : "Date Published"}
                        </h3>
                        <FormattedDate date={book?.publishDate} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium mb-2">{book.format === "Course" ? "Publisher / School" : "Publisher"}</h3>
                      <p>{book.publisher}</p>
                    </div>
                  </div>

                  {book.format === "Course" && book.sections && book.sections.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        Course Curriculum Preview
                      </h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                        {book.sections.map((section, sIdx) => (
                          <div key={sIdx} className="bg-gray-50 p-4">
                            <h4 className="font-bold text-gray-800 text-sm flex justify-between items-center mb-2">
                              <span>Section {sIdx + 1}: {section.title}</span>
                              <span className="text-xs text-gray-500 font-medium">{section.lessons?.length || 0} lessons</span>
                            </h4>
                            <div className="space-y-2 mt-2 pl-4">
                              {section.lessons && section.lessons.map((lesson, lIdx) => (
                                <div key={lIdx} className="flex justify-between items-center text-xs py-1.5 text-gray-600">
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <span>📄</span>
                                    {lesson.title}
                                  </span>
                                  {lesson.duration && (
                                    <span className="text-gray-400">{lesson.duration}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      user={userInfo}
                    />
                  ) : (
                    <div className="bg-purple-50 p-4 rounded-md mb-6">
                      <p className="text-purple-800">
                        Please{" "}
                        <Link
                          to="/login"
                          className="text-purple-600 font-medium hover:underline"
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

              {activeTab === "seller" && (book?.seller || sellerData) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <Store className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {book.seller?.storeName || sellerData?.storeName}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={
                                i <
                                Math.floor(
                                  book.seller?.rating || sellerData?.rating || 0
                                )
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          (
                          {book.seller?.reviewCount ||
                            sellerData?.reviewCount ||
                            0}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        About This Seller
                      </h4>
                      <p className="text-gray-600">
                        {book.seller?.bio ||
                          sellerData?.bio ||
                          "No description provided."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Contact Information
                      </h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>
                          Email:{" "}
                          {book.seller?.contactEmail ||
                            sellerData?.contactEmail}
                        </li>
                        {(book.seller?.phoneNumber ||
                          sellerData?.phoneNumber) && (
                          <li>
                            Phone:{" "}
                            {book.seller?.phoneNumber ||
                              sellerData?.phoneNumber}
                          </li>
                        )}
                        {(book.seller?.address || sellerData?.address) && (
                          <li>
                            Address:{" "}
                            {book.seller?.address || sellerData?.address}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/seller/store/${
                        book.seller?.slug ||
                        sellerData?.slug ||
                        book.seller?._id ||
                        sellerData?._id
                      }`}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Visit Store
                    </Link>
                  </div>
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
