import React, { useState } from "react";
import {
  Users,
  DollarSign,
  Share2,
  Award,
  ChevronDown,
  ChevronUp,
  Copy,
  TrendingUp,
} from "lucide-react";
import { useGetReferralStatsQuery } from "../../../redux/slices/authSlice";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SEO from "../../../components/SEO";

const MLMDashboard = () => {
  const { data: referralData, isLoading, isError } = useGetReferralStatsQuery();
  const [expandedReferral, setExpandedReferral] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleReferralDetails = (id) => {
    if (expandedReferral === id) {
      setExpandedReferral(null);
    } else {
      setExpandedReferral(id);
    }
  };

  const copyToClipboard = () => {
    if (referralData?.referralLink) {
      navigator.clipboard
        .writeText(referralData.referralLink)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type={"page"} />
        <LoadingSkeleton type={"list"} count={3} />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={isError.data?.message} />;
  }

  if (!referralData) return null;

  const stats = [
    {
      name: "Referral Count",
      value: referralData.referralCount,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Total Earnings",
      value: formatCurrency(referralData.earnings),
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "MLM Tier",
      value: `Level ${referralData.currentTier.tier}`,
      icon: <Award className="h-5 w-5" />,
    },
    {
      name: "Commission Rate",
      value: `${referralData.currentTier.commissionRate}%`,
      icon: <Share2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <SEO
        title="Your MLM Progress"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      {/* MLM Progress */}
      {referralData.nextTier && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Your MLM Progress
              </h2>
              <p className="text-sm text-gray-500">
                {formatCurrency(referralData.earningsToNextTier)} more earnings
                needed to reach Level {referralData.nextTier.tier}
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-purple-600">
                {referralData.nextTier.commissionRate}% commission at next level
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (referralData.earnings / referralData.nextTier.minEarnings) *
                    100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Referral Overview
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
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your Referral Link
            </h2>
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              Share this link with your network to earn commissions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-gray-100 px-4 py-2 rounded-lg flex-1 text-sm font-medium overflow-x-auto whitespace-nowrap">
              {referralData.referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copySuccess
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {copySuccess ? (
                "Copied!"
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Direct Referrals */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your Direct Referrals
        </h2>
        {referralData.directReferrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralData.directReferrals.map((referral) => (
                  <tr key={referral._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {referral.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(referral.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(referral.earnings || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't referred anyone yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Share your referral link to start earning commissions!
            </p>
          </div>
        )}
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Commission History
        </h2>
        {referralData.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralData.transactions.map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === "referral"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.type === "referral"
                            ? "Direct Referral"
                            : "MLM Commission"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleReferralDetails(transaction._id)}
                          className="text-purple-600 hover:text-purple-900 flex items-center"
                        >
                          {expandedReferral === transaction._id ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedReferral === transaction._id && (
                      <tr className="bg-purple-50">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                TRANSACTION ID
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {transaction._id}
                              </p>
                            </div>
                            {transaction.description && (
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  DESCRIPTION
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {transaction.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No commission transactions yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Referrals will appear here once you start earning commissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLMDashboard;
