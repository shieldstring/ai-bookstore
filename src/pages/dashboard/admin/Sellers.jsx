import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  Filter,
  Search,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import {
  useGetPendingSellersQuery,
  useGetApprovedSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useDeleteSellerByAdminMutation,
  useGetAdminSellerMetricsQuery,
} from "../../../redux/slices/sellerApiSlice";
import SellerCard from "../../../components/dashboard/seller/SellerCard";
import SEO from "../../../components/SEO";

const Sellers = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // API hooks
  const {
    data: pendingSellers,
    isLoading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useGetPendingSellersQuery();
  const {
    data: approvedSellers,
    isLoading: approvedLoading,
    error: approvedError,
    refetch: refetchApproved,
  } = useGetApprovedSellersQuery();
  const { data: metrics, isLoading: metricsLoading } =
    useGetAdminSellerMetricsQuery();

  // Mutations
  const [approveSeller] = useApproveSellerMutation();
  const [rejectSeller] = useRejectSellerMutation();
  const [deleteSeller] = useDeleteSellerByAdminMutation();

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleApprove = (sellerId) => {
    setSelectedSeller(sellerId);
    setActionType("approve");
    setShowModal(true);
  };

  const handleReject = (sellerId) => {
    setSelectedSeller(sellerId);
    setActionType("reject");
    setShowModal(true);
  };

  const handleDelete = (sellerId) => {
    setSelectedSeller(sellerId);
    setActionType("delete");
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "approve") {
        await approveSeller(selectedSeller).unwrap();
        setSuccessMessage("Seller approved successfully!");
      } else if (actionType === "reject") {
        await rejectSeller({
          id: selectedSeller,
          reason: rejectionReason,
        }).unwrap();
        setSuccessMessage("Seller rejected successfully!");
      } else if (actionType === "delete") {
        await deleteSeller(selectedSeller).unwrap();
        setSuccessMessage("Seller deleted successfully!");
      }

      // Refetch data
      if (actionType === "approve" || actionType === "reject") {
        refetchPending();
      }
      if (actionType === "delete") {
        refetchApproved();
      }

      setShowModal(false);
      setSelectedSeller(null);
      setActionType("");
      setRejectionReason("");
    } catch (error) {
      console.error(`Error ${actionType}ing seller:`, error);
      setErrorMessage(error?.data?.message || `Failed to ${actionType} seller`);
      setShowModal(false);
    }
  };

  // Filter sellers based on search term
  const filteredPendingSellers =
    pendingSellers?.filter(
      (seller) =>
        seller.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredApprovedSellers =
    approvedSellers?.filter(
      (seller) =>
        seller.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    isLoading,
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="flex items-center mt-1">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {trend && !isLoading && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{trend}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-blue-500 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="Seller Management"
        description="Manage seller applications and monitor performance"
        name="Seller Management"
        type="website"
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seller Management
          </h1>
          <p className="text-gray-600">
            Manage seller applications and monitor performance
          </p>
        </motion.div>

        {/* Status Messages */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
          >
            <div className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-4 mb-8"
        >
          <TabButton
            id="overview"
            label="Overview"
            icon={TrendingUp}
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            id="pending"
            label="Pending Applications"
            icon={Clock}
            isActive={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          />
          <TabButton
            id="approved"
            label="Approved Sellers"
            icon={UserCheck}
            isActive={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Sellers"
                  value={metrics?.totalSellers || 0}
                  icon={Users}
                  color="bg-blue-500"
                  isLoading={metricsLoading}
                />
                <MetricCard
                  title="Pending Applications"
                  value={
                    metrics?.pendingApplications || pendingSellers?.length || 0
                  }
                  icon={Clock}
                  color="bg-yellow-500"
                  isLoading={metricsLoading || pendingLoading}
                />
                <MetricCard
                  title="Approved Sellers"
                  value={
                    metrics?.approvedSellers || approvedSellers?.length || 0
                  }
                  icon={UserCheck}
                  color="bg-green-500"
                  trend={metrics?.monthlyGrowth}
                  isLoading={metricsLoading || approvedLoading}
                />
                <MetricCard
                  title="Rejected Applications"
                  value={metrics?.rejectedApplications || 0}
                  icon={UserX}
                  color="bg-red-500"
                  isLoading={metricsLoading}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("pending")}
                    className="flex items-center justify-center p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Review Pending Applications
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("approved")}
                    className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Manage Approved Sellers
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View Analytics
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search sellers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </motion.button>
              </div>

              {/* Pending Sellers Grid */}
              {pendingLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Loading pending sellers...
                  </span>
                </div>
              ) : pendingError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">
                      Error loading pending sellers
                    </span>
                  </div>
                </div>
              ) : filteredPendingSellers.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending applications
                  </h3>
                  <p className="text-gray-600">
                    There are no pending seller applications at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPendingSellers.map((seller) => (
                    <SellerCard
                      key={seller._id}
                      seller={seller}
                      isPending={true}
                      onApprove={() => handleApprove(seller._id)}
                      onReject={() => handleReject(seller._id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "approved" && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search approved sellers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </motion.button>
              </div>

              {/* Approved Sellers Grid */}
              {approvedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Loading approved sellers...
                  </span>
                </div>
              ) : approvedError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">
                      Error loading approved sellers
                    </span>
                  </div>
                </div>
              ) : filteredApprovedSellers.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No approved sellers
                  </h3>
                  <p className="text-gray-600">
                    There are no approved sellers yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredApprovedSellers.map((seller) => (
                    <SellerCard
                      key={seller._id}
                      seller={seller}
                      isPending={false}
                      onDelete={() => handleDelete(seller._id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {actionType === "approve" && "Approve Seller"}
                      {actionType === "reject" && "Reject Application"}
                      {actionType === "delete" && "Delete Seller"}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setRejectionReason("");
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4">
                  {actionType === "approve" &&
                    "Are you sure you want to approve this seller?"}
                  {actionType === "reject" &&
                    "Please provide a reason for rejecting this seller:"}
                  {actionType === "delete" &&
                    "Are you sure you want to delete this seller? This action cannot be undone."}
                </p>

                {actionType === "reject" && (
                  <div className="mb-4">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowModal(false);
                      setRejectionReason("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmAction}
                    disabled={
                      actionType === "reject" && !rejectionReason.trim()
                    }
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      actionType === "approve"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionType === "approve"
                      ? "Confirm Approval"
                      : actionType === "reject"
                      ? "Confirm Rejection"
                      : "Confirm Deletion"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sellers;
