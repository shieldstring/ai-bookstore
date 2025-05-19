import { useState } from "react";
import {
  Search,
  MoreVertical,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} from "../../../redux/slices/ordersApiSlice";
import { format } from "date-fns";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SEO from "../../../components/SEO";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "canceled", label: "Canceled" },
];

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const limit = 10;

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // RTK Query hooks
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({
    page,
    limit,
    status: statusFilter,
    sortField,
    sortOrder,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "delivered":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Delivered
          </span>
        );
      case "processing":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Shipped
          </span>
        );
      case "canceled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Canceled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Pending
          </span>
        );
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateStatus({
        orderId: selectedOrder._id,
        status: newStatus,
      }).unwrap();
      setStatusUpdateOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(selectedOrder._id).unwrap();
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(selectedOrder._id).unwrap();
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        <LoadingSkeleton type={"list"} count={5} />
      </div>
    );
  if (isError) return <ErrorMessage error={"Failed to load order"} />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <SEO
        title="Orders"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Orders</h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalPrice")}
              >
                <div className="flex items-center">
                  Total
                  {getSortIcon("totalPrice")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user?.name || "Guest"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDetailsOpen(true);
                      }}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data?.data?.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {data.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            detailsOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <button
                  onClick={() => setDetailsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.user?.name || "Guest"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.user?.email ||
                        selectedOrder.paymentResult?.email_address ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.shippingAddress?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.postalCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </>
                    ) : (
                      <p>No shipping address provided</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {format(
                        new Date(selectedOrder.createdAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedOrder.status}
                    </p>
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {selectedOrder.isPaid ? "Paid" : "Not Paid"}
                    </p>
                    {selectedOrder.isPaid && (
                      <p>
                        <span className="font-medium">Paid At:</span>{" "}
                        {format(
                          new Date(selectedOrder.paidAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Payment Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Total:</span> $
                      {selectedOrder.totalPrice.toFixed(2)}
                    </p>
                    {selectedOrder.paymentResult && (
                      <>
                        <p>
                          <span className="font-medium">Payment ID:</span>{" "}
                          {selectedOrder.paymentResult.id}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {selectedOrder.paymentResult.status}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>
                                {item.book && (
                                  <p className="text-xs text-gray-500">
                                    SKU: {item.book._id.slice(-6)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelectedOrder(selectedOrder);
                    setStatusUpdateOpen(true);
                  }}
                  disabled={
                    selectedOrder.status === "canceled" ||
                    selectedOrder.status === "delivered"
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelectedOrder(selectedOrder);
                    setCancelDialogOpen(true);
                  }}
                  disabled={
                    selectedOrder.status === "canceled" ||
                    selectedOrder.status === "delivered"
                  }
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelectedOrder(selectedOrder);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={["processing", "shipped"].includes(
                    selectedOrder.status
                  )}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            statusUpdateOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Order Status
                </h3>
                <button
                  onClick={() => setStatusUpdateOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions
                    .filter(
                      (option) => option.value && option.value !== "canceled"
                    )
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setStatusUpdateOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            cancelDialogOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Order
                </h3>
                <button
                  onClick={() => setCancelDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel this order? This action cannot
                  be undone.
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setCancelDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCanceling}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Confirm Cancel"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            deleteDialogOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Order
                </h3>
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to permanently delete this order? This
                  action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
