import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  applyCouponWithSync,
  removeFromCartWithSync,
  updateCartItemWithSync,
  initializeCart,
} from "../redux/slices/cartThunks";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Newsletter from "../components/common/Newsletter";
import SEO from "../components/SEO";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";

const CartPage = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const dispatch = useDispatch();
  const {
    items: cartData, // Rename cart to cartData to avoid confusion
    status,
    error: cartError,
    discount,
    coupon,
  } = useSelector((state) => state.cart);
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [localError, setLocalError] = useState(null);

  // Initialize cart on mount
  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeCart()).unwrap();
      } catch (error) {
        setLocalError(error.message || "Failed to load cart");
      }
    };
    init();
  }, [dispatch]);

  const [isLoading, setIsLoading] = useState(false);

  // New effect to fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!cartData || cartData.length === 0) return;

      try {
        // Fetch book details for each cart item
        setIsLoading(true);
        const enriched = await Promise.all(
          cartData.map(async (item) => {
            const response = await fetch(`${BASE_URL}books/${item.bookId}`);
            if (!response.ok) throw new Error("Failed to fetch book details");

            const bookDetails = await response.json();
            return {
              ...item,
              name: bookDetails.data.title || "Unknown Book",
              image: bookDetails.data.image || "/default-book-cover.jpg",
              price: bookDetails.data.price || 0,
              author: bookDetails.data.author || "Unknown ",
              // Any other book details you need
            };
          })
        );
        setIsLoading(false);
        setEnrichedCart(enriched);
      } catch (err) {
        setLocalError("Failed to fetch book details");
      }
    };

    fetchBookDetails();
  }, [cartData]);

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCartWithSync(itemId)).unwrap();
    } catch (err) {
      setLocalError(err.message || "Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await dispatch(updateCartItemWithSync(itemId, newQuantity)).unwrap();
    } catch (err) {
      setLocalError(err.message || "Failed to update quantity");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      await dispatch(applyCouponWithSync(couponCode)).unwrap();
      setCouponCode("");
    } catch (err) {
      // Error is already handled in the thunk
    }
  };

  const error = cartError || localError;

  if (status === "loading") return <LoadingSpinner />;

  // Show loading state
  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <LoadingSkeleton type={"list"} count={3} />
        </div>
      </section>
    );
  }

  // Calculate totals based on cart items
  const subtotal = enrichedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - discount;

  return (
    <div>
      <SEO
        title="Cart"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 ">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center text-sm">
            <Link
              to="/"
              className="hover:text-gray-600 font-semibold text-purple-700"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">Cart</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl 2xl:max-w-6xl mx-auto px-4 lg:py-10">
        <div className="mb-8">
          {cartData?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="mb-4">
                Browse our collection to find your next read
              </p>
              <Link
                to="/books"
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-purple-800 text-white rounded-t-lg p-3 grid grid-cols-12 gap-4">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Total Price</div>
              </div>

              {enrichedCart.map((item) => (
                <CartItem
                  key={item.id} // Use the cart item ID as the key
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={(newQuantity) =>
                    handleUpdateQuantity(item.id, newQuantity)
                  }
                />
              ))}
            </>
          )}
        </div>

        {cartData?.length > 0 && (
          <div className="bg-pink-100 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">Shopping Summary</h2>
              <p className="text-gray-600 text-sm mb-6">
                Review your items and apply any promo codes before checkout.
              </p>

              <div className="mb-4">
                <p className="mb-2">Have a coupon code?</p>
                <div className="flex">
                  <div className="bg-pink-200 p-2 rounded-l flex items-center justify-center">
                    <span className="text-xs font-bold text-pink-800 px-1">
                      %
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter promo code here"
                    className="p-2 border border-pink-200 flex-grow focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 rounded-r flex items-center"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                {cartData?.coupon?.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {cartData.coupon.error}
                  </p>
                )}
                {cartData?.coupon?.code && !cartData.coupon.error && (
                  <p className="text-green-600 text-sm mt-1">
                    Coupon "{cartData.coupon.code}" applied! (-$
                    {cartData.discount?.toFixed(2)})
                  </p>
                )}
              </div>
            </div>

            <OrderSummary
              subtotal={subtotal || 0}
              discount={discount || 0}
              total={total || 0}
              coupon={coupon || 0}
            />
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default CartPage;
