import { BarChart2, DollarSign, ShoppingCart, Users, Book } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const salesData = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 139 },
    { name: 'Mar', revenue: 2000, orders: 98 },
    { name: 'Apr', revenue: 2780, orders: 190 },
    { name: 'May', revenue: 1890, orders: 120 },
    { name: 'Jun', revenue: 2390, orders: 150 }
  ];

  const stats = [
    { name: "Total Revenue", value: "$24,780", icon: <DollarSign className="h-5 w-5" /> },
    { name: "Total Orders", value: "937", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "New Customers", value: "243", icon: <Users className="h-5 w-5" /> },
    { name: "Top Product", value: "Atomic Habits", icon: <Book className="h-5 w-5" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Store Analytics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Sales Performance</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Acquisition</h3>
          {/* Customer acquisition chart would go here */}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Performance</h3>
          {/* Product performance chart would go here */}
        </div>
      </div>
    </div>
  );
};

export default Analytics;