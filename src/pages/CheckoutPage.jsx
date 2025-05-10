import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreatePaymentIntentMutation,
  useCreateOrderMutation,
  useVerifyPaymentStatusQuery,
} from "../redux/slices/ordersApiSlice";
import { Link, useNavigate } from "react-router-dom";
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
      }
    };

    fetchBookDetails();
  }, [cartData]);

  const { userInfo } = useSelector((state) => state.auth);

  const [createPaymentIntent, { isLoading: loadingPaymentIntent }] =
    useCreatePaymentIntentMutation();
  const [createOrder, { isLoading: loadingOrder, error }] =
    useCreateOrderMutation();
  const navigate = useNavigate();

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    address: userInfo?.address || "",
    city: userInfo?.city || "",
    postalCode: userInfo?.postalCode || "",
    country: userInfo?.country || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderId, setOrderId] = useState(null);

  // Check if cart is empty and redirect if neede=
  useEffect(() => {
    if (!cartData || cartData.length === 0) {
      navigate("/cart");
    }
  }, [cartData, navigate]);

  // Query payment status if we have a paymentId
  const { data: paymentStatusData, refetch: refetchPaymentStatus } =
    useVerifyPaymentStatusQuery(paymentId, { skip: !paymentId });

  // Create payment intent when cart changes or payment method changes
  useEffect(() => {
    if (cartData.length > 0 && paymentMethod === "stripe") {
      const createStripePaymentIntent = async () => {
        try {
          const res = await createPaymentIntent({
            amount: Math.round(total * 100), // Convert to cents
          }).unwrap();

          setClientSecret(res.clientSecret);
          setPaymentId(res.paymentIntentId);
        } catch (err) {
          console.error("Payment intent error:", err);
          setPaymentError(err.data?.message || "Failed to initialize payment");
        }
      };
      createStripePaymentIntent();
    }
  }, [cartData, paymentMethod, createPaymentIntent]);

  // Listen for payment status updates
  useEffect(() => {
    if (paymentStatusData) {
      setPaymentStatus(paymentStatusData.status);

      // If payment succeeded and we have an orderId, navigate to order confirmation
      if (
        paymentStatusData.status === "succeeded" &&
        paymentStatusData.orderId
      ) {
        navigate(`/order/${paymentStatusData.orderId}`);
      }
    }
  }, [paymentStatusData, navigate]);

  // Set up payment status polling
  useEffect(() => {
    let intervalId;

    if (
      paymentId &&
      paymentStatus !== "succeeded" &&
      paymentStatus !== "failed"
    ) {
      intervalId = setInterval(() => {
        refetchPaymentStatus();
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, paymentStatus, refetchPaymentStatus]);

  // If we have an orderId but no paymentStatusData orderId, and we're still on checkout page,
  // navigate to the order page after a delay
  useEffect(() => {
    let timeoutId;

    if (
      orderId &&
      !paymentStatusData?.orderId &&
      paymentStatus === "processing"
    ) {
      timeoutId = setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId, paymentStatusData, paymentStatus, navigate]);

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
      // For Stripe payment - in a real implementation this would use Stripe Elements
      if (paymentMethod === "stripe") {
        console.log("Processing payment with Stripe ID:", paymentId);
      }

      // Create the order
      const orderData = {
        orderItems: cartData,
        shippingAddress: shippingInfo,
        paymentMethod,
        totalPrice: total,
        paymentResult: {
          id: paymentId || "simulated_payment_id",
          status: "pending",
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      };

      const res = await createOrder(orderData).unwrap();
      setOrderId(res._id);

      // Clear cart after successful order creation
      dispatch(clearLocalCart());

      // For PayPal, navigate immediately
      if (paymentMethod !== "stripe") {
        navigate(`/order/${res._id}`);
      } else {
        // For Stripe, set up processing state and wait for webhook or timeout
        setPaymentStatus("processing");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setPaymentError(err.data?.message || "Failed to place order");
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
      <section className="max-w-6xl mx-auto text-white py-12 lg:py-16">
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
              to="/cart"
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

      {paymentStatus === "processing" && (
        <div className="bg-blue-50 text-purple-700 p-4 mb-6 rounded-md flex items-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Processing payment... Please wait.</span>
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
                  Credit/Debit Card (Stripe)
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
                  <h3 className="text-sm font-medium mb-2">Card Details</h3>
                  {loadingPaymentIntent ? (
                    <div className="h-12 flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : clientSecret ? (
                    <div className="p-4 bg-gray-200 rounded-md">
                      {/* In a real implementation, you would inject Stripe Elements here */}
                      {/* <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm />
                      </Elements> */}
                      <p className="text-center text-gray-600">
                        Stripe Payment Ready (Payment ID: {paymentId})
                      </p>
                      <p className="text-center text-gray-500 text-xs mt-2">
                        (Webhooks will confirm this payment once completed)
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm">
                      Payment initialization failed
                    </div>
                  )}
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
              loadingPaymentIntent ||
              cartData.length === 0 ||
              (paymentMethod === "stripe" && !clientSecret) ||
              !isFormValid ||
              paymentStatus === "processing"
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingOrder ||
            loadingPaymentIntent ||
            paymentStatus === "processing" ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </div>
            ) : (
              "Place Order"
            )}
          </button>

          <p className="mt-3 text-xs text-gray-500">
            By placing your order, you agree to our
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>
            and
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
