import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const NetworkStats = ({ stats }) => {
  const data = [
    { name: 'Level 1', count: stats?.level1Count || 0 },
    { name: 'Level 2', count: stats?.level2Count || 0 },
    { name: 'Level 3', count: stats?.level3Count || 0 },
    { name: 'Level 4', count: stats?.level4Count || 0 },
    { name: 'Level 5', count: stats?.level5Count || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Network Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4f46e5" name="Team Members" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkStats;