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
import BookRecommendations from "../../../components/dashboard/BookRecommendations";
import RecentOrders from "../../../components/dashboard/RecentOrders";
import UserProfileCard from "../../../components/dashboard/UserProfileCard";
import UpcomingChallenges from "../../../components/dashboard/UpcomingChallenges";
import { useGetRecommendationsQuery } from "../../../redux/slices/bookSlice";
import { useGetMyEnrollmentsQuery } from "../../../redux/slices/enrollmentApiSlice";
import SEO from "../../../components/SEO";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const { data, isLoading, error } = useGetUserDashboardQuery();
  const [books, setBooks] = useState([]);
  const { data: recommemdedbooks } = useGetRecommendationsQuery();
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetMyEnrollmentsQuery();

  useEffect(() => {
    if (recommemdedbooks) {
      setBooks(recommemdedbooks.data);
    }
  }, [data]);


  if (isLoading)
    return (
      <div className="space-y-4">
        <LoadingSkeleton type={"page"} />
        <LoadingSkeleton type={"card2"} count={4} />
      </div>
    );
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xs border border-purple-500/20">
            <div className="absolute right-0 top-0 -mt-4 -mr-4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/20 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  Active Learner
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-white via-slate-105 to-purple-200 bg-clip-text text-transparent">{data.name}</span>!
                </h1>
                <p className="text-purple-200/70 text-xs sm:text-sm mt-1 max-w-xl font-light">
                  Here is your learning & reading dashboard for{" "}
                  <strong className="text-white font-medium">
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </strong>
                  . Track your progress, courses, and certifications in real-time.
                </p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952c] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition duration-300 self-start md:self-auto cursor-pointer"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Enrolled Courses */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  My Active Courses
                </h2>
              </div>
              <Link
                to="/dashboard/courses"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                View all
              </Link>
            </div>
            <div className="p-6">
              {enrollmentsLoading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-slate-100 animate-pulse rounded-lg"></div>
                  <div className="h-10 bg-slate-100 animate-pulse rounded-lg"></div>
                </div>
              ) : (enrollmentsData?.data || []).length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <p className="text-sm font-medium">No courses enrolled yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Unlock learning by visiting our{" "}
                    <Link to="/courses" className="text-purple-600 hover:underline font-bold">
                      Courses Directory
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(enrollmentsData?.data || []).slice(0, 2).map((enrollment) => {
                    const course = enrollment.courseId;
                    if (!course) return null;
                    const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
                    const completedCount = enrollment.completedLessons?.length || 0;
                    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                    
                    return (
                      <div
                        key={enrollment._id}
                        className="flex gap-4 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-14 object-cover rounded-lg shadow-sm border border-slate-100"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs truncate">
                              <Link to={`/dashboard/courses/${course._id}`}>{course.title}</Link>
                            </h4>
                            <p className="text-slate-550 text-[10px] mt-0.5">Instructor: {course.author}</p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-grow bg-slate-100 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-700 font-bold">{progressPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
            <div className="px-6 pb-6">
              {data.groups.slice(0, 2).map((group) => (
                <div
                  key={group._id}
                  className="flex items-center p-2 text-sm border-b hover:bg-slate-100"
                >
                  <Link to={`/dashboard/groups/${group._id}`}>
                    <span className="truncate">{group.name}</span>
                  </Link>
                </div>
              ))}
              {data.groups.length > 2 && (
                <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
                  +{data.groups.length - 2} more groups
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
