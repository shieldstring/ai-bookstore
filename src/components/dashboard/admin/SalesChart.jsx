import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

const SalesChart = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="mr-1 h-4 w-4" />
          <span>Total: ${data.reduce((sum, month) => sum + month.revenue, 0).toLocaleString()}</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={50}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '0.5rem' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar 
              dataKey="revenue" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;