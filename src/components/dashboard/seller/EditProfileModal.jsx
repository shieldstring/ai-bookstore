import React, { useState } from "react";

// Edit Profile Modal Component
const EditProfileModal = ({ profile, onClose, onSave, isSaving }) => {
  const [storeName, setStoreName] = useState(profile?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    profile?.storeDescription || ""
  );
  const [contactEmail, setContactEmail] = useState(profile?.contactEmail || "");
  const [storeUrl, setStoreUrl] = useState(profile?.storeUrl || ""); // Assuming storeUrl can be edited

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ storeName, storeDescription, contactEmail, storeUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Seller Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="storeDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Description
            </label>
            <textarea
              id="storeDescription"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="storeUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store URL (Optional)
            </label>
            <input
              type="url"
              id="storeUrl"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., https://yourstore.com"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
