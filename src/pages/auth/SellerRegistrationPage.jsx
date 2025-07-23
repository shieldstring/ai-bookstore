import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRegisterSellerMutation } from "../../redux/slices/sellerApiSlice";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { useDispatch } from "react-redux";
import { setCredential } from "../../redux/slices/authSlice";

const SellerRegistrationPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const [formData, setFormData] = useState({
    storeName: "",
    bio: "",
    banner: "",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    payoutDetails: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [registerSeller, { isLoading, isSuccess, error }] =
    useRegisterSellerMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested payoutDetails fields
    if (name.startsWith("payoutDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        payoutDetails: {
          ...prev.payoutDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        [fieldName]: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Failed to upload image. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    // Validate payout details if any field is filled
    if (
      formData.payoutDetails.bankName ||
      formData.payoutDetails.accountNumber ||
      formData.payoutDetails.accountName
    ) {
      if (!formData.payoutDetails.bankName.trim()) {
        newErrors["payoutDetails.bankName"] = "Bank name is required";
      }
      if (!formData.payoutDetails.accountNumber.trim()) {
        newErrors["payoutDetails.accountNumber"] = "Account number is required";
      }
      if (!formData.payoutDetails.accountName.trim()) {
        newErrors["payoutDetails.accountName"] = "Account name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await registerSeller(formData).unwrap();
      // Update user credentials in Redux store after successful registration
      if (response.user) {
        dispatch(
          setCredential({
            ...response.user,
            role: "seller", // Ensure the role is updated to 'seller'
          })
        );
      }

      // Update localStorage as well
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
          role: "seller",
        })
      );
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your seller account has been created and is pending approval. We'll
            notify you once your account is approved.
          </p>
          <button
            onClick={() => navigate("/seller/index")}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Become a Seller"
        description="Register as a seller on our platform to start selling your products"
        name="Seller Registration"
        type="website"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl"
      >
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-600 md:w-1/3 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Join Our Marketplace</h2>
              <p className="text-purple-100">
                Start selling to thousands of customers
              </p>
            </div>
          </div>

          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Seller Registration
              </h1>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center text-red-500 text-sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  {error.data?.message || "Registration failed"}
                </motion.div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Store Information */}
              <div>
                <label
                  htmlFor="storeName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Name *
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.storeName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  required
                />
                {errors.storeName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.storeName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tell us about your store"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={(e) => handleImageUpload(e, "logo")}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    disabled={uploading}
                  />
                  {formData.logo && (
                    <div className="mt-2">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="banner"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Banner
                  </label>
                  <input
                    type="file"
                    id="banner"
                    name="banner"
                    onChange={(e) => handleImageUpload(e, "banner")}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    disabled={uploading}
                  />
                  {formData.banner && (
                    <div className="mt-2">
                      <img
                        src={formData.banner}
                        alt="Banner preview"
                        className="h-16 w-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.contactEmail ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  required
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Street, City, Country"
                />
              </div>

              {/* Payout Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Payout Information
                </h3>

                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="payoutDetails.bankName"
                    value={formData.payoutDetails.bankName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors["payoutDetails.bankName"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  />
                  {errors["payoutDetails.bankName"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["payoutDetails.bankName"]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="payoutDetails.accountNumber"
                      value={formData.payoutDetails.accountNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors["payoutDetails.accountNumber"]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                    />
                    {errors["payoutDetails.accountNumber"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["payoutDetails.accountNumber"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="accountName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Account Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="payoutDetails.accountName"
                      value={formData.payoutDetails.accountName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors["payoutDetails.accountName"]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                    />
                    {errors["payoutDetails.accountName"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["payoutDetails.accountName"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || uploading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      {uploading ? "Uploading..." : "Processing..."}
                    </>
                  ) : (
                    "Register as Seller"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerRegistrationPage;
