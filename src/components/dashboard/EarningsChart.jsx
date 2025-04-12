import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const EarningsChart = ({ earningsData }) => {
  // Process data to group by month if needed
  const processData = (data) => {
    if (!data || data.length === 0) {
      return [
        { month: 'Jan', earnings: 0 },
        { month: 'Feb', earnings: 0 },
        { month: 'Mar', earnings: 0 },
        { month: 'Apr', earnings: 0 },
        { month: 'May', earnings: 0 },
        { month: 'Jun', earnings: 0 },
      ];
    }

    // Group by month and sum earnings
    const monthlyEarnings = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + item.amount;
    });

    // Fill in missing months with 0
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return allMonths.slice(0, 6).map(month => ({
      month,
      earnings: monthlyEarnings[month] || 0
    }));
  };

  const chartData = processData(earningsData);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Earnings']} />
            <Area type="monotone" dataKey="earnings" stroke="#10b981" fill="#a7f3d0" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;