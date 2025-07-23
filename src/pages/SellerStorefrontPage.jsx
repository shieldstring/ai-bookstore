import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useGetSellerStorefrontQuery } from "../redux/slices/sellerApiSlice";
import { Star, Heart, ShoppingCart, Share2 } from "lucide-react";
import SEO from "../components/SEO";
import { useDispatch } from "react-redux";
import { addToCartWithSync } from "../redux/slices/cartThunks";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SellerStorefrontPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const { idOrSlug } = useParams();
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [seller, setSeller] = useState("");
  const [booksData, setBooksData] = useState([]);

  // Fetch seller info
  const {
    data: sellerData,
    isLoading: sellerLoading,
    isError: sellerError,
    error: sellerErrorData,
  } = useGetSellerStorefrontQuery(idOrSlug);

  useEffect(() => {
    if (sellerData) {
      setSeller(sellerData.data.sellerProfile);
      setBooksData(sellerData.data.books);
    }
  }, [sellerData]);

  const handleAddToCart = async (bookId) => {
    setIsAddingToCart(true);
    try {
      await dispatch(
        addToCartWithSync({
          bookId,
          quantity: 1,
        })
      );
      toast.success("Book added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(error?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: seller.storeName,
      text:
        seller.storeDescription || `Check out ${seller.storeName}'s book store`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
        // Fallback to copy to clipboard if sharing fails
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch (copyErr) {
          console.error("Failed to copy:", copyErr);
          toast.error("Failed to share. Please copy the URL manually.");
        }
      }
    }
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (sellerError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Store
          </h2>
          <p className="text-gray-600 mb-4">
            {sellerErrorData?.data?.message || "Unable to load this store"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Store Not Found
          </h2>
          <p className="text-gray-600">
            The store you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={seller.storeName}
        description={
          seller.bio || `Shop books at ${seller.storeName}'s store`
        }
        name={seller.storeName}
        type="website"
      />

      {/* Store Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {seller.storeName}
              </h1>
              <p className="text-gray-600">{seller.bio}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-5 h-5 mr-1" />
                <span>Share</span>
              </button>
              <button
                className={`flex items-center ${
                  isWishlist
                    ? "text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsWishlist(!isWishlist)}
              >
                <Heart
                  className="w-5 h-5 mr-1"
                  fill={isWishlist ? "currentColor" : "none"}
                />
                <span>{isWishlist ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 py-8 sm:px-6 lg:px-8">
        {/* All Books Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Available Books
          </h2>

          {booksData?.data?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">
                This seller hasn't listed any books yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
              {booksData?.map((book) => (
                <motion.div
                  key={book._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No cover image</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 p-2 flex flex-col items-center space-y-2 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddToCart(book._id)}
                        disabled={isAddingToCart}
                        className="bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-purple-600 disabled:opacity-50"
                      >
                        {isAddingToCart ? (
                          <svg
                            className="animate-spin h-4 w-4 text-purple-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-2 sm:p-4">
                    <Link
                      to={`/books/${book._id}`}
                      className="text-base sm:text-lg font-semibold
                      text-gray-900"
                    >
                      {book.title}
                    </Link>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Math.round(book.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({book.reviewCount || 0})
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${book.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(book._id)}
                      disabled={isAddingToCart}
                      className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
                    >
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Store Info Section */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            About {seller.storeName}
          </h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Contact
                  </h3>
                  <p className="text-gray-600">{seller.contactEmail}</p>
                  {seller.phoneNumber && (
                    <p className="text-gray-600 mt-1">{seller.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Location
                  </h3>
                  {seller.address ? (
                    <p className="text-gray-600">{seller.address}</p>
                  ) : (
                    <p className="text-gray-500 italic">No address provided</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Store Policies
                  </h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Free shipping on orders over $50</li>
                    <li>• 30-day return policy</li>
                    <li>• Secure checkout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerStorefrontPage;
