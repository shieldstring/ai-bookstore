import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen } from 'lucide-react';

const ReadingProgressChart = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Pages Read This Month</h3>
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="mr-1 h-4 w-4" />
          <span>{data.reduce((sum, day) => sum + day.pages, 0)} total pages</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split('-')[2]}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '0.5rem' }}
              formatter={(value) => [`${value} pages`, 'Pages']}
            />
            <Area 
              type="monotone" 
              dataKey="pages" 
              stroke="#8b5cf6" 
              fill="#ede9fe" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReadingProgressChart;