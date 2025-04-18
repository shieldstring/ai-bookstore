import React from 'react';
import { useGetAdminDashboardQuery } from '../../services/api';
import { 
  BarChart2, Book, ShoppingCart, Users, DollarSign, Package 
} from 'lucide-react';
import StatsCard from './StatsCard';
import SalesChart from './SalesChart';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load dashboard data" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Store Overview</h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          icon={<DollarSign className="h-5 w-5" />}
          title="Total Revenue"
          value={`$${data.stats.totalRevenue.toLocaleString()}`}
          change={`${data.stats.revenueChange}% from last month`}
        />
        <StatsCard 
          icon={<ShoppingCart className="h-5 w-5" />}
          title="Total Orders"
          value={data.stats.totalOrders}
          change={`${data.stats.orderChange}% from last month`}
        />
        <StatsCard 
          icon={<Users className="h-5 w-5" />}
          title="New Customers"
          value={data.stats.newCustomers}
          change={`${data.stats.customerChange}% from last month`}
        />
        <StatsCard 
          icon={<Book className="h-5 w-5" />}
          title="Top Selling"
          value={data.stats.topSelling.title}
          change={`${data.stats.topSelling.quantity} sold`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center">
            <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Sales Analytics</h2>
          </div>
          <div className="p-6">
            <SalesChart data={data.salesData} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center">
            <Package className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Inventory Status</h2>
          </div>
          <div className="p-6">
            {/* Inventory component */}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <Book className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Top Selling Books</h2>
            </div>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View all
            </button>
          </div>
          <div className="p-6">
            <TopProducts products={data.topProducts} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View all
            </button>
          </div>
          <div className="p-6">
            <RecentOrders orders={data.recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;