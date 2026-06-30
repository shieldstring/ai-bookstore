import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateOrderMutation,
  useCreatePayPalOrderMutation,
} from "../redux/slices/ordersApiSlice";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import Newsletter from "../components/common/Newsletter";
import SEO from "../components/SEO";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";
import { initializeCart } from "../redux/slices/cartThunks";
import { enrichCartItems } from "../utils/fetchProductDetails";
import useCurrency from "../hooks/useCurrency";

const CheckoutPage = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currency, formatPlain } = useCurrency();

  const { items: cartData, error: cartError } = useSelector(
    (state) => state.cart
  );
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [localError, setLocalError] = useState(null);

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

  useEffect(() => {
    const fetchProductData = async () => {
      if (!cartData || cartData.length === 0) {
        setEnrichedCart([]);
        return;
      }

      try {
        setIsLoading(true);
        const enriched = await enrichCartItems(BASE_URL, cartData, currency);
        setEnrichedCart(enriched);
      } catch (err) {
        setLocalError("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [cartData, BASE_URL, currency]);

  const { userInfo } = useSelector((state) => state.auth);

  const [createPayPalOrder, { isLoading: loadingPayPal }] =
    useCreatePayPalOrderMutation();
  const [createOrder, { isLoading: loadingOrder, error }] =
    useCreateOrderMutation();

  const [shippingInfo, setShippingInfo] = useState({
    address: userInfo?.address || "",
    city: userInfo?.city || "",
    postalCode: userInfo?.postalCode || "",
    country: userInfo?.country || "",
  });
  const [paymentError, setPaymentError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !cartData?.length) {
      navigate("/cart");
    }
  }, [cartData, navigate, isLoading]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const total = enrichedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 0;
  const subtotal = total;
  const shipping = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    try {
      setIsRedirecting(true);

      const formattedOrderItems = enrichedCart.map((item) => ({
        book: item.bookId || item.id,
        name: item.name,
        quantity: item.quantity,
        image: item.image || "",
        price: item.price,
      }));

      const orderData = {
        orderItems: formattedOrderItems,
        shippingAddress: shippingInfo,
        paymentMethod: "paypal",
        currency,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        paymentResult: {
          id: "paypal_pending",
          status: "pending",
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      };

      const orderResult = await createOrder(orderData).unwrap();

      const paypalResult = await createPayPalOrder({
        orderId: orderResult._id,
        currency,
        successUrl: `${window.location.origin}/checkout/success?order_id=${orderResult._id}`,
        cancelUrl: `${window.location.origin}/cart`,
      }).unwrap();

      if (paypalResult.approvalUrl) {
        window.location.href = paypalResult.approvalUrl;
      } else {
        throw new Error("PayPal approval URL not received");
      }
    } catch (err) {
      console.error("PayPal checkout error:", err);
      setPaymentError(err.data?.message || err.message || "Failed to process PayPal payment");
      setIsRedirecting(false);
    }
  };

  const isFormValid =
    shippingInfo.address &&
    shippingInfo.city &&
    shippingInfo.postalCode &&
    shippingInfo.country;

  if (isLoading) {
    return (
      <section className="px-2 lg:px-28 mx-auto text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <LoadingSkeleton type={"list"} count={3} />
        </div>
      </section>
    );
  }

  return (
    <div className="">
      <SEO
        title="Checkout"
        description="Complete your purchase securely with PayPal."
        name="Wisdom Peters"
        type="description"
      />
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

      {(error || paymentError || cartError || localError) && (
        <ErrorMessage error={error || paymentError || cartError || localError} />
      )}

      {isRedirecting && (
        <div className="bg-blue-50 text-purple-700 p-4 mb-6 rounded-md flex items-center mx-auto">
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Redirecting to PayPal to complete your payment...</span>
        </div>
      )}

      <div className="p-2 lg:px-28 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className=" space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center gap-3">
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal"
                  className="h-8"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">PayPal</p>
                  <p className="text-xs text-gray-600">
                    Pay securely in {currency}. You&apos;ll be redirected to PayPal after placing your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {enrichedCart?.map((item) => (
              <div
                key={item._id || item.bookId}
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
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatPlain(item.price * item.quantity, { priceIsConverted: true })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <div className="pt-2 flex justify-between font-bold">
              <span>Total ({currency})</span>
              <span>{formatPlain(total, { priceIsConverted: true })}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loadingOrder ||
              loadingPayPal ||
              cartData?.length === 0 ||
              !isFormValid ||
              isRedirecting
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingOrder || loadingPayPal || isRedirecting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </div>
            ) : (
              "Pay with PayPal"
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

      <Newsletter />
    </div>
  );
};

export default CheckoutPage;
