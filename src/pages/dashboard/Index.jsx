import React from 'react';
import { useGetUserStatsQuery, useGetReadingProgressQuery, useGetRecommendedBooksQuery } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import ReadingProgress from '../../components/dashboard/ReadingProgress';
import BookRecommendations from '../../components/dashboard/BookRecommendations';
import UpcomingChallenges from '../../components/dashboard/UpcomingChallenges';
import EarningsSummary from '../../components/dashboard/EarningsSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAppSelector } from '../../hooks/redux';
import { FiBook, FiAward, FiDollarSign, FiUsers } from 'react-icons/fi';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  // RTK Query hooks
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useGetUserStatsQuery(user?._id || '', { skip: !user });
  
  const {
    data: readingProgress,
    isLoading: progressLoading,
    error: progressError
  } = useGetReadingProgressQuery(user?._id || '', { skip: !user });
  
  const {
    data: recommendedBooks,
    isLoading: booksLoading,
    error: booksError
  } = useGetRecommendedBooksQuery(user?._id || '', { skip: !user });

  if (!user) return <LoadingSpinner fullScreen />;

  const isLoading = statsLoading || progressLoading || booksLoading;
  const error = statsError || progressError || booksError;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}</h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {error && (
          <ErrorMessage 
            message="Failed to load dashboard data" 
            onRetry={() => window.location.reload()} 
          />
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={<FiBook className="text-blue-500" size={24} />}
                title="Books Read"
                value={stats?.booksRead || 0}
                change={stats?.booksReadChange || 0}
                loading={statsLoading}
              />
              <StatsCard
                icon={<FiAward className="text-green-500" size={24} />}
                title="Challenges"
                value={stats?.challengesCompleted || 0}
                change={stats?.challengesChange || 0}
                loading={statsLoading}
              />
              <StatsCard
                icon={<FiUsers className="text-purple-500" size={24} />}
                title="Referrals"
                value={stats?.referrals || 0}
                change={stats?.referralsChange || 0}
                loading={statsLoading}
              />
              <StatsCard
                icon={<FiDollarSign className="text-yellow-500" size={24} />}
                title="Earnings"
                value={`$${stats?.earnings?.toFixed(2) || '0.00'}`}
                change={stats?.earningsChange || 0}
                loading={statsLoading}
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Reading Progress */}
                <ReadingProgress 
                  progress={readingProgress} 
                  loading={progressLoading} 
                />

                {/* Book Recommendations */}
                <BookRecommendations 
                  books={recommendedBooks} 
                  loading={booksLoading} 
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <UpcomingChallenges />
                <EarningsSummary earnings={stats?.earningsBreakdown} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;