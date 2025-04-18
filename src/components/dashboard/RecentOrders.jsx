import { ShoppingBag, Check, Clock, X } from 'lucide-react';

const RecentOrders = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-start">
            <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg text-purple-600 mr-4">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">Order #{order.id}</h4>
                <span className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center mt-1">
                {getStatusIcon(order.status)}
                <span className="ml-2 text-xs text-gray-500 capitalize">{order.status}</span>
                <span className="mx-1 text-gray-300">•</span>
                <span className="text-xs text-gray-500">{order.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;