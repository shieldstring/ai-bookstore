import React, { useState, useEffect } from "react";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

const EditProfileModal = ({ profile, onClose, onSave, isSaving }) => {
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
      accountName: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        storeName: profile.storeName || "",
        bio: profile.bio || "",
        banner: profile.banner || "",
        logo: profile.logo || "",
        contactEmail: profile.contactEmail || "",
        contactPhone: profile.contactPhone || "",
        address: profile.address || "",
        payoutDetails: profile.payoutDetails || {
          bankName: "",
          accountNumber: "",
          accountName: ""
        }
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is part of payoutDetails
    if (name.startsWith('payoutDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        payoutDetails: {
          ...prev.payoutDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        [fieldName]: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({
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
      newErrors.storeName = 'Store name is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    // Validate payout details if provided
    if (formData.payoutDetails.bankName || formData.payoutDetails.accountNumber || formData.payoutDetails.accountName) {
      if (!formData.payoutDetails.bankName.trim()) {
        newErrors['payoutDetails.bankName'] = 'Bank name is required';
      }
      if (!formData.payoutDetails.accountNumber.trim()) {
        newErrors['payoutDetails.accountNumber'] = 'Account number is required';
      }
      if (!formData.payoutDetails.accountName.trim()) {
        newErrors['payoutDetails.accountName'] = 'Account name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare the data to be saved
    const dataToSave = {
      storeName: formData.storeName,
      bio: formData.bio,
      banner: formData.banner,
      logo: formData.logo,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      payoutDetails: formData.payoutDetails
    };
    
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Seller Profile
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Store Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Store Information
            </h3>
            
            <div className="mb-4">
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.storeName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                required
              />
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Store Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tell customers about your store"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
                <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Banner
                </label>
                <input
                  type="file"
                  id="banner"
                  name="banner"
                  onChange={(e) => handleImageUpload(e, "banner")}
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Contact Information
            </h3>
            
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                required
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="+1234567890"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Street, City, Country"
              />
            </div>
          </div>

          {/* Payout Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Payout Information
            </h3>
            
            <div className="mb-4">
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="payoutDetails.bankName"
                value={formData.payoutDetails.bankName}
                onChange={handleChange}
                className={`w-full p-3 border ${errors['payoutDetails.bankName'] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
              />
              {errors['payoutDetails.bankName'] && (
                <p className="mt-1 text-sm text-red-600">{errors['payoutDetails.bankName']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="payoutDetails.accountNumber"
                  value={formData.payoutDetails.accountNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors['payoutDetails.accountNumber'] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                />
                {errors['payoutDetails.accountNumber'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['payoutDetails.accountNumber']}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="payoutDetails.accountName"
                  value={formData.payoutDetails.accountName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors['payoutDetails.accountName'] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                />
                {errors['payoutDetails.accountName'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['payoutDetails.accountName']}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || uploading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploading}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isSaving || uploading) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploading ? "Uploading..." : "Saving..."}
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;