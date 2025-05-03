import React, { useEffect, useState } from "react";
import { useGetUserDashboardQuery } from "../../../redux/slices/authSlice";
import {
  BookOpen,
  Star,
  Trophy,
  Award,
  ShoppingBag,
  Users,
  Bookmark,
  DollarSign,
} from "lucide-react";
import ErrorMessage from "../../../components/common/ErrorMessage";
import StatsCard from "../../../components/dashboard/StatsCard";
import ReadingProgressChart from "../../../components/dashboard/ReadingProgressChart";
import BookRecommendations from "../../../components/dashboard/BookRecommendations";
import RecentOrders from "../../../components/dashboard/RecentOrders";
import UserProfileCard from "../../../components/dashboard/UserProfileCard";
import UpcomingChallenges from "../../../components/dashboard/UpcomingChallenges";
import { useGetBooksQuery } from "../../../redux/slices/bookSlice";
import SEO from "../../../components/SEO";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const { data, isLoading, error } = useGetUserDashboardQuery();
  const [books, setBooks] = useState([]);
  const { data: book } = useGetBooksQuery();

  useEffect(() => {
    if (book?.books) {
      setBooks(book.books);
    }
  }, [book]);

  if (isLoading) return <LoadingSkeleton type={"page"} />;
  if (error) return <ErrorMessage error="Failed to load dashboard data" />;

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-6 md:px-8 md:py-6">
      <SEO
        title="Profile"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {data.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your reading overview for{" "}
              {new Date().toLocaleDateString("en-US", { month: "long" })}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <StatsCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Level"
              value={data.level}
              // change={`${data.booksReadingChange} from last month`}
            />
            <StatsCard
              icon={<Bookmark className="h-5 w-5" />}
              title="Experience"
              value={data.xp}
            />
            <StatsCard
              icon={<DollarSign className="h-5 w-5" />}
              title="Tokens"
              value={`${data.tokens}`}
            />
            <StatsCard
              icon={<Award className="h-5 w-5" />}
              title="Reward Points"
              value={data.earnings}
            />
          </div>

          {/* Reading Progress */}
          {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Reading Progress</h2>
            </div>
            <div className="p-6">
              <ReadingProgressChart data={data.readingProgress ||[]} />
            </div>
          </div> */}

          {/* Recommendations and Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Recommended For You
                </h2>
              </div>
              <div className="p-6">
                <BookRecommendations books={books} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Trophy className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Upcoming Challenges
                </h2>
              </div>
              <div className="p-6">
                <UpcomingChallenges
                  challenges={data.upcomingChallenges || []}
                />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h2>
              </div>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View all
              </button>
            </div>
            <div className="p-6">
              <RecentOrders orders={data.purchaseHistory} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileCard
            user={data}
            groups={data.groups}
            achievements={data.achievements || []}
          />

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Reading Groups
              </h2>
            </div>
            <div className="p-6">{/* Group membership component */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
