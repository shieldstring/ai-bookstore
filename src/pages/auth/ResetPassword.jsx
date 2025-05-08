import React, { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../redux/slices/authSlice";

function ResetPassword() {
  const { resetToken } = useParams(); // Get the resetToken from URL params
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Optional: Validate the resetToken when component mounts
    if (!resetToken) {
      toast.error("Invalid password reset link");
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Include the resetToken in the request payload
      const res = await resetPassword({
        token: resetToken,
        password: credentials.password,
      });

      if (res?.data) {
        toast.success(res.data.msg || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res?.error?.data?.msg || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err?.data?.msg || err.error || "An error occurred");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div>
      <SEO
        title="Reset Password"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="mx-auto">
        <div className="hidden lg:block">
          <h3
            className="text-2xl lg:text-4xl font-bold leading-6 text-gray-800 capitalize"
            id="modal-title"
          >
            Reset password
          </h3>
          <p className="mt-2 text-sm text-[#495454] font-light">
            Enter your new passwords below to reset your password
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error.data?.message || "Failed to reset password"}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="relative bg-white w-16 pb-2 rounded-full px-auto block text-xs text-[#000] font-semibold">
              Password
            </label>
            <div className="flex -mr-px">
              <input
                required
                name="password"
                value={credentials.password}
                onChange={handleChange}
                type="password"
                className={`py-2.5 px-5 border-[0.5px] bg-[#F6F8F8] border-[#000] rounded-lg w-full focus:outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="relative bg-white w-36 pb-2 rounded-full px-auto block text-xs text-[#000] font-semibold">
              Confirm Password
            </label>
            <div className="flex -mr-px">
              <input
                required
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleChange}
                type="password"
                className={`py-2.5 px-5 border-[0.5px] bg-[#F6F8F8] border-[#000] rounded-lg w-full focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-5 w-full">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
