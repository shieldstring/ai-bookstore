import {
  X,
  Loader2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useGetOrderByIdQuery } from "../../redux/slices/ordersApiSlice";
import LoadingSkeleton from "../preloader/LoadingSkeleton";

const OrderDetailsModal = ({ orderId, onClose }) => {
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);

  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    processing: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
    shipped: <Truck className="h-5 w-5 text-blue-500" />,
    delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
    canceled: <AlertCircle className="h-5 w-5 text-red-500" />,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSkeleton type={"page"} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Failed to load order details
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {/* Order Summary */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Order ID:
                  </span>
                  <span className="text-sm text-gray-900">#{order._id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Date:
                  </span>
                  <span className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Status:
                  </span>
                  <div className="flex items-center">
                    {statusIcons[order.status]}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Payment Method:
                  </span>
                  <span className="text-sm text-gray-900 capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </h4>
                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Order Items
                </h4>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.book._id} className="flex justify-between">
                      <div className="flex">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.book.image || "/book-placeholder.jpg"}
                            alt={item.book.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-center">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.book.title}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {item.book.author}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
