import { useState } from 'react';
import { 
  BarChart2, DollarSign, ShoppingCart, Users, Book, TrendingUp, 
  UserCheck, Award, ArrowUp, ArrowDown, Calendar, Filter 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { useGetDashboardStatsQuery, useGetSalesAnalyticsQuery } from '../../../redux/slices/analyticsApiSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Analytics = () => {
  const { data: dashboardData, isLoading, isError } = useGetDashboardStatsQuery();
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: salesData } = useGetSalesAnalyticsQuery({ period, year });

  if (isLoading) return <div className="text-center py-10">Loading analytics...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading analytics</div>;

  // Format sales data based on selected period
  const formatSalesData = () => {
    if (!salesData?.data) return [];
    
    return salesData.data.map(item => {
      let name;
      if (salesData.dateFormat === 'month') {
        name = monthNames[item._id - 1];
      } else if (salesData.dateFormat === 'week') {
        name = `Week ${item._id}`;
      } else {
        name = `Day ${item._id}`;
      }
      
      return {
        name,
        revenue: item.revenue,
        orders: item.orders,
        aov: item.averageOrderValue
      };
    });
  };

  const formattedSalesData = formatSalesData();
  const formattedMonthlySales = dashboardData?.monthlySales?.map(item => ({
    name: monthNames[item._id - 1],
    revenue: item.revenue,
    orders: item.orders
  })) || [];

  const stats = [
    { 
      name: "Total Revenue", 
      value: `$${(dashboardData?.salesStats?.totalRevenue || 0).toLocaleString()}`, 
      icon: <DollarSign className="h-5 w-5" />,
      change: '+12%',
      trend: 'up'
    },
    { 
      name: "Total Orders", 
      value: (dashboardData?.salesStats?.totalOrders || 0).toLocaleString(), 
      icon: <ShoppingCart className="h-5 w-5" />,
      change: '+5%',
      trend: 'up'
    },
    { 
      name: "Active Users", 
      value: (dashboardData?.userStats?.activeUsers || 0).toLocaleString(), 
      icon: <UserCheck className="h-5 w-5" />,
      change: '+8%',
      trend: 'up'
    },
    { 
      name: "Total Users", 
      value: (dashboardData?.userStats?.totalUsers || 0).toLocaleString(), 
      icon: <Users className="h-5 w-5" />,
      change: '+15%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Analytics</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Last 30 Days</span>
            </div>
            <button className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    index === 0 ? 'bg-purple-100 text-purple-600' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    index === 2 ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Performance */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Sales Performance</h3>
            </div>
            <div className="flex space-x-2">
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <select 
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm"
              >
                {[2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                    if (name === 'aov') return [`$${value.toFixed(2)}`, 'Avg. Order Value'];
                    return [value, 'Orders'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Earners */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Top Earners</h3>
            </div>
            <div className="space-y-4">
              {dashboardData?.topEarners?.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="font-semibold">${user.earnings.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Avg. Order Value']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="aov" 
                    name="Avg. Order Value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Analytics;