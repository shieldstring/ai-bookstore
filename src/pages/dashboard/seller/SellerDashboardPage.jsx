import React, { useState } from "react";
import {
  useGetSellerDashboardQuery,
  useEditSellerProfileMutation,
  useDeleteSellerProfileMutation,
  useRequestReapprovalMutation,
} from "../../../redux/slices/sellerApiSlice";
import {
  LayoutDashboard,
  User,
  Package,
  Settings,
  Pencil,
  Trash2,
  RefreshCcw,
  ExternalLink,
  ShoppingCart,
  XCircle,
  Info,
} from "lucide-react";
import EditProfileModal from "../../../components/dashboard/seller/EditProfileModal";
import SellerStatusBadge from "../../../components/dashboard/seller/SellerStatusBadge";
import SEO from "../../../components/SEO";

// Main Seller Dashboard Component
const SellerDashboardPage = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSellerDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [editSellerProfile, { isLoading: isSavingProfile }] =
    useEditSellerProfileMutation();
  const [deleteSellerProfile, { isLoading: isDeletingProfile }] =
    useDeleteSellerProfileMutation();
  const [requestReapproval, { isLoading: isRequestingReapproval }] =
    useRequestReapprovalMutation();

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditProfile = async (profileData) => {
    try {
      await editSellerProfile(profileData).unwrap();
      alert("Profile updated successfully!");
      setShowEditModal(false);
      refetch();
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(`Failed to update profile: ${err.data?.message || err.error}`);
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your seller profile? This action is irreversible and will remove all your seller data."
      )
    ) {
      try {
        await deleteSellerProfile().unwrap();
        alert("Seller profile deleted successfully!");
        // Redirect to home or appropriate page after deletion
        window.location.href = "/";
      } catch (err) {
        console.error("Failed to delete profile:", err);
        alert(`Failed to delete profile: ${err.data?.message || err.error}`);
      }
    }
  };

  const handleRequestReapproval = async () => {
    if (
      window.confirm(
        "Are you sure you want to request re-approval for your seller profile?"
      )
    ) {
      try {
        await requestReapproval().unwrap();
        alert(
          "Re-approval request submitted successfully! Please wait for admin review."
        );
        refetch();
      } catch (err) {
        console.error("Failed to request re-approval:", err);
        alert(
          `Failed to request re-approval: ${err.data?.message || err.error}`
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.data?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData?.sellerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Not a Registered Seller
          </h2>
          <p className="text-gray-600 mb-6">
            It looks like you don't have a seller profile yet. Register to start
            selling!
          </p>
          <button
            onClick={() => (window.location.href = "/seller/register")}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Become a Seller
          </button>
        </div>
      </div>
    );
  }

  const { sellerProfile, sellerMetrics } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Seller Dashboard"
        description="Manage your seller profile, view metrics, and track your sales performance"
        name="Seller Dashboard"
        type="website"
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard size={32} className="text-purple-600" />
            Seller Dashboard
          </h1>
          <SellerStatusBadge status={sellerProfile.status} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-xl shadow-sm p-6 space-y-4 h-fit sticky top-24">
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-purple-600 bg-purple-50 font-medium hover:bg-purple-100 transition-colors"
            >
              <LayoutDashboard size={20} /> Dashboard Home
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={20} /> My Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors opacity-70 cursor-not-allowed"
            >
              <Package size={20} /> My Products (Coming Soon)
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors opacity-70 cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Orders (Coming Soon)
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors opacity-70 cursor-not-allowed"
            >
              <Settings size={20} /> Settings (Coming Soon)
            </a>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="md:col-span-2 space-y-8">
          {/* Seller Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-purple-600" />
                My Profile
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  disabled={sellerProfile.status === "pending"}
                >
                  <Pencil size={18} /> Edit Profile
                </button>
                {sellerProfile.status === "rejected" && (
                  <button
                    onClick={handleRequestReapproval}
                    disabled={isRequestingReapproval}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCcw size={18} />{" "}
                    {isRequestingReapproval
                      ? "Requesting..."
                      : "Request Re-approval"}
                  </button>
                )}
                <button
                  onClick={handleDeleteProfile}
                  disabled={isDeletingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />{" "}
                  {isDeletingProfile ? "Deleting..." : "Delete Profile"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500">Store Name</p>
                <p className="text-lg font-semibold">
                  {sellerProfile.storeName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Email
                </p>
                <p className="text-lg">{sellerProfile.contactEmail}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">
                  Store Description
                </p>
                <p className="text-lg">
                  {sellerProfile.storeDescription || "No description provided."}
                </p>
              </div>
              {sellerProfile.slug && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Storefront URL
                  </p>
                  <a
                    href={`/seller/store/${sellerProfile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-purple-600 hover:underline"
                  >
                    {`${window.location.origin}/seller/store/${sellerProfile.slug}`}
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            {sellerProfile.status === "pending" && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <Info
                  size={20}
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-yellow-800">
                    Profile Under Review
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your seller profile is currently pending approval by our
                    administrators. We will notify you once a decision has been
                    made.
                  </p>
                </div>
              </div>
            )}

            {sellerProfile.status === "rejected" && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <XCircle
                  size={20}
                  className="text-red-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-red-800">Profile Rejected</p>
                  {sellerProfile.rejectionReason && (
                    <p className="text-sm text-red-700 mb-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {sellerProfile.rejectionReason}
                    </p>
                  )}
                  <p className="text-sm text-red-700">
                    Please review your information and request re-approval after
                    making necessary changes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Seller Metrics Card */}
          {sellerMetrics && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <LayoutDashboard size={24} className="text-teal-600" />
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <p className="text-sm font-medium text-purple-700">
                    Total Sales
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    ${sellerMetrics.totalSales?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <p className="text-sm font-medium text-green-700">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {sellerMetrics.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <p className="text-sm font-medium text-purple-700">
                    Average Rating
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {sellerMetrics.averageRating?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={sellerProfile}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProfile}
          isSaving={isSavingProfile}
        />
      )}
    </div>
  );
};

export default SellerDashboardPage;
