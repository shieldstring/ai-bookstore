import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats } from '../../features/auth/authSlice';
import { fetchReadingProgress } from '../../features/books/bookSlice';
import { fetchRecommendedBooks } from '../../features/social/socialSlice';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import ReadingProgress from '../../components/dashboard/ReadingProgress';
import BookRecommendations from '../../components/dashboard/BookRecommendations';
import UpcomingChallenges from '../../components/dashboard/UpcomingChallenges';
import EarningsSummary from '../../components/dashboard/EarningsSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { readingProgress, status: bookStatus } = useSelector((state) => state.books);
  const { recommendedBooks, status: socialStatus } = useSelector((state) => state.social);
  const { mlmStats, status: mlmStatus } = useSelector((state) => state.mlm);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserStats(user._id));
      dispatch(fetchReadingProgress(user._id));
      dispatch(fetchRecommendedBooks(user._id));
    }
  }, [dispatch, user]);

  if (!user) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Books Read" 
            value={user.stats?.booksRead || 0} 
            icon="📚" 
            trend="12% increase"
          />
          <StatsCard 
            title="Active Groups" 
            value={user.stats?.groupsJoined || 0} 
            icon="👥" 
            trend="3 new this month"
          />
          <StatsCard 
            title="Reading Streak" 
            value={user.stats?.readingStreak || 0} 
            icon="🔥" 
            trend="5 days in a row"
          />
          <StatsCard 
            title="Total Earnings" 
            value={`$${user.stats?.totalEarnings?.toFixed(2) || '0.00'}`} 
            icon="💰" 
            trend="20% from last month"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reading Progress */}
          <div className="lg:col-span-2 space-y-6">
            <ReadingProgress progress={readingProgress} isLoading={bookStatus === 'loading'} />
            
            <BookRecommendations 
              books={recommendedBooks} 
              isLoading={socialStatus === 'loading'} 
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingChallenges />
            
            <EarningsSummary 
              earnings={mlmStats} 
              isLoading={mlmStatus === 'loading'} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;