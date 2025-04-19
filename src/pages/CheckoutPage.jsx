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

const CheckoutPage = () => {
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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

  // Query payment status if we have a paymentId
  const { data: paymentStatusData, refetch: refetchPaymentStatus } =
    useVerifyPaymentStatusQuery(paymentId, { skip: !paymentId });

  // Create payment intent when cart changes
  useEffect(() => {
    if (cart.items.length > 0 && paymentMethod === "stripe") {
      const createStripePaymentIntent = async () => {
        try {
          const { clientSecret, paymentIntentId } = await createPaymentIntent({
            amount: Math.round(cart.total * 100), // Convert to cents
          }).unwrap();
          setClientSecret(clientSecret);
          setPaymentId(paymentIntentId);
        } catch (err) {
          setPaymentError(err.data?.message || "Failed to initialize payment");
        }
      };
      createStripePaymentIntent();
    }
  }, [cart, paymentMethod, createPaymentIntent]);

  // Listen for payment status updates
  useEffect(() => {
    if (paymentStatusData) {
      setPaymentStatus(paymentStatusData.status);

      // If payment is successful but we're still on checkout page,
      // it means the webhook confirmed the payment but redirect didn't happen
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
      // For Stripe payment
      if (paymentMethod === "stripe") {
        // In a real implementation with Stripe Elements:
        // const { error } = await stripe.confirmPayment({
        //   elements,
        //   confirmParams: {
        //     return_url: `${window.location.origin}/payment/callback`,
        //   },
        // });

        // if (error) {
        //   setPaymentError(error.message);
        //   return;
        // }

        // Since we're not using real Stripe Elements, just simulate payment
        console.log("Processing payment with ID:", paymentId);
      }

      // Create the order
      const orderData = {
        orderItems: cart.items,
        shippingAddress: shippingInfo,
        paymentMethod,
        itemsPrice: cart.subtotal,
        taxPrice: cart.tax,
        shippingPrice: cart.shipping,
        totalPrice: cart.total,
        paymentResult: {
          id: paymentId || "simulated_payment_id",
          status: "pending",
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      };

      const res = await createOrder(orderData).unwrap();

      // Clear cart after successful order creation
      dispatch(clearLocalCart());

      // For PayPal or other payment methods that don't use webhooks
      if (paymentMethod !== "stripe") {
        navigate(`/order/${res._id}`);
      } else {
        // For Stripe, let's set up a loading state and wait for webhook
        setPaymentStatus("processing");
        // If the webhook hasn't come back after 5 seconds, navigate anyway
        // The payment status will be updated later via the webhook
        setTimeout(() => {
          navigate(`/order/${res._id}`);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setPaymentError(err.data?.message || "Failed to place order");
    }
  };

  // Check if form is valid
  const isFormValid =
    shippingInfo.address &&
    shippingInfo.city &&
    shippingInfo.postalCode &&
    shippingInfo.country;

  return (
    <div className="">
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

      {paymentStatus === "processing" && (
        <div className="bg-blue-50 text-blue-700 p-4 mb-6 rounded-md flex items-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Processing payment... Please wait.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping and Payment Info */}
        <div className="lg:col-span-2 space-y-6">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
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
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${cart.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loadingOrder ||
              loadingPaymentIntent ||
              cart.items.length === 0 ||
              (paymentMethod === "stripe" && !clientSecret) ||
              !isFormValid ||
              paymentStatus === "processing"
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            By placing your order, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
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
