import { ShoppingBag, Check, Clock, X, Search, Loader2 } from "lucide-react";
import SEO from "../../../components/SEO";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import OrderDetailsModal from "../../../components/dashboard/OrderDetailsModal";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import { useGetOrdersQuery } from "../../../redux/slices/ordersApiSlice";
import ErrorMessage from "../../../components/common/ErrorMessage";
import useCurrency from "../../../hooks/useCurrency";

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
  const { formatOrder } = useCurrency();

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

  const statusClasses = {
    pending: "bg-amber-50 text-amber-700 border-amber-150",
    processing: "bg-blue-50 text-blue-700 border-blue-150",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-150",
    delivered: "bg-emerald-50 text-emerald-755 border-emerald-150",
    canceled: "bg-rose-50 text-rose-700 border-rose-150",
  };

  return (
    <>
      <SEO
        title="My Orders"
        description="Your order history"
        name="BookStore"
        type="ecommerce"
      />
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 min-h-[70vh]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl text-slate-800 font-extrabold">My Orders</h2>
            <p className="text-slate-500 text-xs mt-1">Review your recent purchases and check transaction status</p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-slate-350 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-xl w-full md:w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/50">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">
                {searchTerm ? "No matching orders found" : "No orders yet"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? "Try searching for another transaction code or status."
                  : "Your orders and digital assets will appear here once purchased."}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead>
                <tr className="bg-slate-50/75">
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-655 font-bold">
                      {order.orderItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-extrabold">
                      {formatOrder(order.totalPrice, order.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xxs font-bold uppercase tracking-wider rounded-md border ${statusClasses[order.status] || "bg-slate-50 text-slate-700 border-slate-150"}`}>
                        {statusIcons[order.status] || statusIcons.pending}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrderId(order._id)}
                        className="text-purple-650 hover:text-purple-800 cursor-pointer bg-transparent border-none p-0 text-xs font-bold transition-colors"
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