import { ShoppingBag, Check, Clock, X, Search, Loader2 } from "lucide-react";
import SEO from "../../../components/SEO";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import OrderDetailsModal from "../../../components/dashboard/OrderDetailsModal";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import { useGetOrdersQuery } from "../../../redux/slices/ordersApiSlice";
import ErrorMessage from "../../../components/common/ErrorMessage";

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  processing: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
  shipped: <Check className="h-4 w-4 text-blue-500" />,
  delivered: <Check className="h-4 w-4 text-green-500" />,
  canceled: <X className="h-4 w-4 text-red-500" />,
};

const MyOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetOrdersQuery();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    refetch();
  }, [refetch]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Properly accessing the orders array from the response
  const orders = data?.data || [];

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.totalPrice.toString().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <LoadingSkeleton type={"list"} count={5} />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={"Error loading orders. Please try again."} />;
  }

  return (
    <>
      <SEO
        title="My Orders"
        description="Your order history"
        name="BookStore"
        type="ecommerce"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm ? "No matching orders found" : "No orders yet"}
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "Your orders will appear here"}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
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
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {statusIcons[order.status] || statusIcons.pending}
                        <span className="ml-2 text-sm text-gray-500 capitalize">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrderId(order._id)}
                        className="text-purple-600 hover:text-purple-900 cursor-pointer bg-transparent border-none p-0 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
};

export default MyOrders;