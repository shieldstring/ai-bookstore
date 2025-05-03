// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMLMStats, fetchDownline } from '../../../redux/slices/mlmApiSlice';
// import DownlineTable from '../../components/mlm/DownlineTable';
// import PayoutHistory from '../../components/mlm/PayoutHistory';
// import CommissionCalculator from '../../components/mlm/CommissionCalculator';
// import LoadingSpinner from '../../../components/common/LoadingSpinner';
// import NetworkStats from '../../../components/dashboard/NetworkStats';
// import EarningsChart from '../../../components/dashboard/EarningsChart';

// const MLMDashboard = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { stats, downline, status, error } = useSelector((state) => state.mlm);

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchMLMStats(user._id));
//       dispatch(fetchDownline(user._id));
//     }
//   }, [dispatch, user]);

//   if (status === 'loading') return <LoadingSpinner />;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (

//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold">Your MLM Network</h1>

//         <NetworkStats stats={stats} />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <EarningsChart earningsData={stats?.earningsHistory || []} />
//           </div>
//           <div>
//             <CommissionCalculator
//               currentLevel={stats?.currentLevel}
//               commissionRates={stats?.commissionRates}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <DownlineTable downline={downline} />
//           </div>
//           <div>
//             <PayoutHistory payouts={stats?.payoutHistory || []} />
//           </div>
//         </div>
//       </div>

//   );
// };

// export default MLMDashboard;

import { Users, ArrowRight, DollarSign, Activity } from "lucide-react";
import SEO from "../../../components/SEO";
import { useEffect } from "react";

const MLMDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const stats = [
    { name: "Total Team", value: "24", icon: <Users className="h-5 w-5" /> },
    {
      name: "Active Members",
      value: "18",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: "This Month Earnings",
      value: "$1,245",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Lifetime Earnings",
      value: "$8,760",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      level: 1,
      joinDate: "2023-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Chen",
      level: 2,
      joinDate: "2023-02-28",
      status: "active",
    },
    {
      id: 3,
      name: "Emily Wilson",
      level: 1,
      joinDate: "2023-03-10",
      status: "inactive",
    },
  ];

  return (
    <div className="space-y-6">
      <SEO
        title="My Network"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Network Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Team</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Level {member.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 flex items-center">
                        View <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Commission History
        </h2>
        {/* Commission chart/table would go here */}
      </div>
    </div>
  );
};

export default MLMDashboard;
