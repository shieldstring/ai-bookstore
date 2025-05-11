import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateCheckoutSessionMutation,
  useCreateOrderMutation,
  useVerifyCheckoutStatusQuery,
} from "../redux/slices/ordersApiSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import Newsletter from "../components/common/Newsletter";
import { clearLocalCart } from "../redux/slices/cartSlice";
import SEO from "../components/SEO";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";
import { initializeCart } from "../redux/slices/cartThunks";

const CheckoutPage = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  
  const { items: cartData, error: cartError } = useSelector(
    (state) => state.cart
  );
  const [enrichedCart, setEnrichedCart] = useState([]);
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
              name: bookDetails.title || "Unknown Book",
              image: bookDetails.image || "/default-book-cover.jpg",
              price: bookDetails.price || 0,
              author: bookDetails.author || "Unknown ",
              // Any other book details you need
            };
          })
        );
        setIsLoading(false);
        setEnrichedCart(enriched);
      } catch (err) {
        setLocalError("Failed to fetch book details");
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [cartData, BASE_URL]);

  const { userInfo } = useSelector((state) => state.auth);

  const [createCheckoutSession, { isLoading: loadingCheckoutSession }] =
    useCreateCheckoutSessionMutation();
  const [createOrder, { isLoading: loadingOrder, error }] =
    useCreateOrderMutation();

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    address: userInfo?.address || "",
    city: userInfo?.city || "",
    postalCode: userInfo?.postalCode || "",
    country: userInfo?.country || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentError, setPaymentError] = useState("");
  const [checkoutSessionId, setCheckoutSessionId] = useState(sessionId || "");
  const [orderId, setOrderId] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (!isLoading && !cartData?.length && !sessionId) {
      navigate("/cart");
    }
  }, [cartData, navigate, isLoading, sessionId]);

  // Query checkout status if we have a sessionId
  const { data: checkoutStatusData, refetch: refetchCheckoutStatus } =
    useVerifyCheckoutStatusQuery(checkoutSessionId, { skip: !checkoutSessionId });

  // Check session status when returning from Stripe
  useEffect(() => {
    if (sessionId && !orderId) {
      // If we have a session ID from URL, check its status
      refetchCheckoutStatus();
    }
  }, [sessionId, refetchCheckoutStatus, orderId]);

  // Process checkout status data
  useEffect(() => {
    if (checkoutStatusData) {
      // If payment is complete and we have an orderId, navigate to order confirmation
      if (
        checkoutStatusData.status === "paid" &&
        checkoutStatusData.orderId
      ) {
        dispatch(clearLocalCart());
        navigate(`/order/${checkoutStatusData.orderId}`);
      }
    }
  }, [checkoutStatusData, navigate, dispatch]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    try {
      if (paymentMethod === "stripe") {
        setIsRedirecting(true);
        
        // Format line items for Stripe Checkout
        const items = enrichedCart.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.author ? `by ${item.author}` : undefined,
              images: item.image ? [item.image] : undefined,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }));

        // Create a checkout session
        const checkoutResult = await createCheckoutSession({
          amount: Math.round(total * 100), // Total in cents
          items,
          // Dynamic success/cancel URLs based on current URL
          successUrl: `${window.location.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }).unwrap();

        // Store the checkout session ID
        setCheckoutSessionId(checkoutResult.sessionId);
        
        // Create order first to associate with payment
        const orderData = {
          orderItems: cartData,
          shippingAddress: shippingInfo,
          paymentMethod,
          totalPrice: total,
          paymentResult: {
            id: checkoutResult.sessionId,
            status: "pending",
            update_time: new Date().toISOString(),
            email_address: userInfo.email,
          },
          checkoutSessionId: checkoutResult.sessionId,
        };

        const orderResult = await createOrder(orderData).unwrap();
        setOrderId(orderResult._id);
        
        // Redirect to Stripe Checkout
        window.location.href = checkoutResult.url;
        
      } else if (paymentMethod === "paypal") {
        // Create the order for PayPal payment
        const orderData = {
          orderItems: cartData,
          shippingAddress: shippingInfo,
          paymentMethod,
          totalPrice: total,
          paymentResult: {
            id: "paypal_pending",
            status: "pending",
            update_time: new Date().toISOString(),
            email_address: userInfo.email,
          },
        };

        const res = await createOrder(orderData).unwrap();
        setOrderId(res._id);
        
        // Clear cart after successful order creation
        dispatch(clearLocalCart());
        
        // For PayPal, navigate to order page (you'd implement PayPal button there)
        navigate(`/order/${res._id}`);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setPaymentError(err.data?.message || "Failed to place order");
      setIsRedirecting(false);
    }
  };

  // Check if form is valid
  const isFormValid =
    shippingInfo.address &&
    shippingInfo.city &&
    shippingInfo.postalCode &&
    shippingInfo.country;

  // Show loading state
  if (isLoading) {
    return (
      <section className="max-w-xl mx-auto text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <LoadingSkeleton type={"list"} count={3} />
        </div>
      </section>
    );
  }

  // Calculate totals based on cart items
  const total = enrichedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Show processing state when returning from Stripe with session_id
  if (sessionId && !checkoutStatusData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <SEO
        title="Checkout"
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
            <Link
              to="cart"
              className="hover:text-gray-600 font-semibold text-purple-700"
            >
              Cart
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
        </div>
      </div>

      {(error || paymentError) && (
        <ErrorMessage error={error || paymentError} />
      )}

      {isRedirecting && (
        <div className="bg-blue-50 text-purple-700 p-4 mb-6 rounded-md flex items-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Preparing checkout... You'll be redirected to complete payment.</span>
        </div>
      )}

      <div className="p-2 lg:px-28 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Payment Info */}
        <div className=" space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="h-4 w-4 text-purple-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="stripe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Stripe
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="h-4 w-4 text-purple-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="paypal"
                  className="ml-2 block text-sm text-gray-900"
                >
                  PayPal
                </label>
              </div>

              {paymentMethod === "stripe" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Secure Checkout</h3>
                  <div className="p-4 bg-gray-200 rounded-md">
                    <p className="text-xs text-center text-gray-600">
                      You'll be redirected to Stripe's secure payment page after clicking "Place Order"
                    </p>
                    <div className="flex justify-center mt-3 space-x-2">
                      <img src="/visa.png" alt="Visa" className="h-6" />
                      <img src="/master.png" alt="Mastercard" className="h-6" />
                      <img src="/amex.png" alt="American Express" className="h-6" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className=" bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {enrichedCart?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <div className="pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loadingOrder ||
              loadingCheckoutSession ||
              cartData?.length === 0 ||
              !isFormValid ||
              isRedirecting
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingOrder ||
            loadingCheckoutSession ||
            isRedirecting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </div>
            ) : (
              "Place Order"
            )}
          </button>

          <p className="mt-3 text-xs text-gray-500">
            By placing your order, you agree to our{" "}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default CheckoutPage;