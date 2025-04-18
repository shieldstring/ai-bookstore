import React from 'react';
import { useGetUserDashboardQuery } from '../../services/api';
import { 
  BookOpen, Star, Trophy, Award, ShoppingBag, Users, Bookmark, DollarSign 
} from 'lucide-react';
import StatsCard from './StatsCard';
import ReadingProgressChart from './ReadingProgressChart';
import BookRecommendations from './BookRecommendations';
import UpcomingChallenges from './UpcomingChallenges';
import RecentOrders from './RecentOrders';
import UserProfileCard from './UserProfileCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const UserDashboard = () => {
  const { data, isLoading, error } = useGetUserDashboardQuery();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load dashboard data" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {data.user.name}!</h1>
            <p className="text-gray-600 mt-2">
              Here's your reading overview for {new Date().toLocaleDateString('en-US', { month: 'long' })}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              icon={<BookOpen className="h-5 w-5" />}
              title="Books Reading"
              value={data.stats.booksReading}
              change={`${data.stats.booksReadingChange} from last month`}
            />
            <StatsCard 
              icon={<Bookmark className="h-5 w-5" />}
              title="Pages Read"
              value={data.stats.pagesRead}
              change={`${data.stats.pagesReadChange}% progress`}
            />
            <StatsCard 
              icon={<Award className="h-5 w-5" />}
              title="Current Streak"
              value={`${data.stats.currentStreak} days`}
              change={data.stats.streakChange >= 0 ? `+${data.stats.streakChange}` : data.stats.streakChange}
            />
            <StatsCard 
              icon={<DollarSign className="h-5 w-5" />}
              title="Reward Points"
              value={data.stats.rewardPoints}
              change={`Earned ${data.stats.pointsEarned} this month`}
            />
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Reading Progress</h2>
            </div>
            <div className="p-6">
              <ReadingProgressChart data={data.readingProgress} />
            </div>
          </div>

          {/* Recommendations and Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Recommended For You</h2>
              </div>
              <div className="p-6">
                <BookRecommendations books={data.recommendations} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Trophy className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Challenges</h2>
              </div>
              <div className="p-6">
                <UpcomingChallenges challenges={data.upcomingChallenges} />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-purple-500 mr-2" />
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

        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileCard 
            user={data.user}
            groups={data.groups}
            achievements={data.achievements}
          />
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Reading Groups</h2>
            </div>
            <div className="p-6">
              {/* Group membership component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

