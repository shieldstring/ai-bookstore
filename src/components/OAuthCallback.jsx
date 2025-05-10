import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingSpinner from "./common/LoadingSpinner";
import { setCredential } from "../redux/slices/authSlice";

const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract user data from URL
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");

    if (encodedData) {
      try {
        // Decode the base64 user data
        const decodedData = atob(encodedData);
        const userData = JSON.parse(decodedData);

        // Store user data in Redux
        dispatch(setCredential(userData));

        // Redirect to home page or the page user was trying to access
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin"); // Clean up

        // Navigate to the redirect URL
        navigate(redirectUrl, { replace: true });
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        navigate("/login", { replace: true });
      }
    } else {
      // No data found, redirect to login
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Completing your sign in...</p>
    </div>
  );
};

export default OAuthCallback;
