import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorMessage from "./common/ErrorMessage";
import { clearCartWithSync } from "../redux/slices/cartThunks";
import { useVerifyPaymentMutation } from "../redux/slices/ordersApiSlice";

const CheckoutSuccess = () => {
  const [verifyPayment] = useVerifyPaymentMutation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyStripePayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        const orderId = params.get("order_id");

        console.log("Payment success redirect params:", { sessionId, orderId });

        if (!sessionId || !orderId) {
          setError("Missing payment information");
          setLoading(false);
          return;
        }

        // Make sure orderId is not still a placeholder
        if (orderId.includes("{") || orderId.includes("}")) {
          setError("Invalid order ID format");
          setLoading(false);
          return;
        }

        // Verify the payment with your backend
        await verifyPayment({
          sessionId,
          orderId,
        }).unwrap();

        // Clear the cart again to be sure
        dispatch(clearCartWithSync());

        // Redirect to the order page
        navigate(`/dashboard/orders`);
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.data?.message || "Failed to verify payment");
        setLoading(false);
      }
    };

    verifyStripePayment();
  }, [location.search, dispatch, navigate, verifyPayment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="sm" className="mr-2" />
        <p className="ml-2">Confirming your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8 px-4">
        <ErrorMessage
          error={`${error}. Please contact customer support if you believe this is an error.`}
        />

        <div className="mt-4 mx-auto">
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckoutSuccess;
