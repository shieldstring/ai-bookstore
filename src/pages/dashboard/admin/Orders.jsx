import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Loader2,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  X,
  AlertCircle,
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const [userType] = useState("admin"); // Can be 'admin' or 'seller'
  const limit = 10;

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newItemStatus, setNewItemStatus] = useState("");

  // Error and success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // RTK Query hooks
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useGetAllOrdersQuery({
    page,
    limit,
    status: statusFilter,
    sortField,
    sortOrder,
    userType,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Filter orders based on search term
  const filteredOrders =
    data?.data?.filter(
      (order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
    if (!newStatus || !selectedOrder) return;

    try {
      await updateStatus({
        orderId: selectedOrder._id,
        status: newStatus,
      }).unwrap();
      setStatusUpdateOpen(false);
      setSuccess("Order status updated successfully!");
      setNewStatus("");
      refetch();
    } catch (err) {
      setError(err?.data?.message || "Failed to update order status");
      console.error("Failed to update status:", err);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      await cancelOrder(selectedOrder._id).unwrap();
      setCancelDialogOpen(false);
      setSuccess("Order canceled successfully!");
      refetch();
    } catch (err) {
      setError(err?.data?.message || "Failed to cancel order");
      console.error("Failed to cancel order:", err);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder._id).unwrap();
      setDeleteDialogOpen(false);
      setSuccess("Order deleted successfully!");
      refetch();
    } catch (err) {
      setError(err?.data?.message || "Failed to delete order");
      console.error("Failed to delete order:", err);
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

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const openStatusUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusUpdateOpen(true);
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const openItemStatusModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setNewItemStatus(item.status || "pending");
  };

  const closeAllModals = () => {
    setDetailsOpen(false);
    setStatusUpdateOpen(false);
    setCancelDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedOrder(null);
    setSelectedItem(null);
    setNewStatus("");
    setNewItemStatus("");
  };

  const exportToExcel = () => {
    if (!data?.data) return;

    // Prepare data for export
    const exportData = data.data.flatMap((order) =>
      order.orderItems.map((item) => ({
        "Order ID": order._id,
        "Order Date": format(new Date(order.createdAt), "MMM dd, yyyy HH:mm"),
        Customer: order.user?.name || "Guest",
        "Product Name": item.name,
        SKU: item.book?._id.slice(-6) || "",
        Quantity: item.quantity,
        "Unit Price": `$${item.price.toFixed(2)}`,
        Total: `$${(item.price * item.quantity).toFixed(2)}`,
        "Order Status": order.status,
        "Item Status": item.status || "pending",
        "Payment Method": order.paymentMethod,
        "Total Amount": `$${order.totalPrice.toFixed(2)}`,
        Status: order.status,
        "Payment Status": order.isPaid ? "Paid" : "Not Paid",
        "Shipping Address": order.shippingAddress
          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
          : "N/A",
        "Items Count": order.orderItems.length,
      }))
    );

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file
    saveAs(dataBlob, `orders_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // Add this function for CSV export
  const exportToCSV = () => {
    if (!data?.data) return;

    const exportData = data.data.map((order) => ({
      "Order ID": order._id,
      Date: format(new Date(order.createdAt), "MMM dd, yyyy HH:mm"),
      "Customer Name": order.user?.name || "Guest",
      "Customer Email": order.user?.email || "",
      "Total Amount": `$${order.totalPrice.toFixed(2)}`,
      Status: order.status,
      "Payment Method": order.paymentMethod,
      "Payment Status": order.isPaid ? "Paid" : "Not Paid",
      "Shipping Address": order.shippingAddress
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
        : "N/A",
      "Items Count": order.orderItems.length,
    }));

    const csv = XLSX.utils.json_to_sheet(exportData);
    const csvOutput = XLSX.utils.sheet_to_csv(csv);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `orders_${new Date().toISOString().split("T")[0]}.csv`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type="list" count={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        error={queryError?.data?.message || "Failed to load orders"}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <SEO
        title="Orders Management"
        description="Manage and track orders in your AI-Powered Social-Ecommerce Platform"
        name="AI-Powered Social-Ecommerce"
        type="description"
      />

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <div className="text-green-600 text-sm">{success}</div>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div className="text-red-600 text-sm">{error}</div>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>

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
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={exportToExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export to Excel
                </button>
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export to CSV
                </button>
              </div>
            </div>
          </div>
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
            {filteredOrders.map((order) => (
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openStatusUpdateModal(order)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Update Status"
                      disabled={
                        order.status === "canceled" ||
                        order.status === "delivered"
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(order)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Order"
                      disabled={["processing", "shipped"].includes(
                        order.status
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No orders found matching your search"
              : "No orders found"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {data.totalPages} ({data.totalOrders} total
            orders)
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
      {selectedOrder && detailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <button
                  onClick={closeAllModals}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
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
                      {getStatusBadge(selectedOrder.status)}
                    </p>
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {selectedOrder.isPaid ? "Paid" : "Not Paid"}
                    </p>
                    {selectedOrder.isPaid && selectedOrder.paidAt && (
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
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
                          <td className="px-4 py-3">
                            {getStatusBadge(item.status || "pending")}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                openItemStatusModal(selectedOrder, item)
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm"
                              disabled={
                                selectedOrder.status === "canceled" ||
                                selectedOrder.status === "delivered"
                              }
                            >
                              Update Status
                            </button>
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
                    closeAllModals();
                    openStatusUpdateModal(selectedOrder);
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
                    closeAllModals();
                    openCancelModal(selectedOrder);
                  }}
                  disabled={
                    selectedOrder.status === "canceled" ||
                    selectedOrder.status === "delivered"
                  }
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedOrder && statusUpdateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Order Status
                </h3>
                <button
                  onClick={closeAllModals}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
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
                  onClick={closeAllModals}
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
