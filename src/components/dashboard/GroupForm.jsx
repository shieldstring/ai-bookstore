import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateGroupMutation } from "../../redux/slices/groupApiSlice";
import LoadingSpinner from "../common/LoadingSpinner";

const GroupForm = ({ setModal }) => {
  const navigate = useNavigate();
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const group = await createGroup(formData).unwrap();
      setModal(false); // Close the modal
      navigate(`/dashboard/groups/${group._id}`); // Navigate to the new group
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Group
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="group-name"
            className="text-left block text-sm font-medium text-gray-700 mb-1"
          >
            Group Name *
          </label>
          <input
            id="group-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Book Club"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="group-description"
            className="text-left block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="group-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            minLength={10}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your group's purpose"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </span>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;
