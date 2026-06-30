import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthRoute from "./components/AuthRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import Wishlist from "./pages/dashboard/customer/Wishlist";
import MyOrders from "./pages/dashboard/customer/MyOrders";
import MyAccount from "./pages/dashboard/customer/MyAccount";
import MLMDashboard from "./pages/dashboard/customer/MLMDashboard";
import Groups from "./pages/dashboard/customer/Groups";
import Analytics from "./pages/dashboard/admin/Analytics";
import Customers from "./pages/dashboard/admin/Customers";
import AdminOrders from "./pages/dashboard/admin/Orders";
import AdminSettings from "./pages/dashboard/admin/Settings";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/dashboard/customer/UserDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Recommendations from "./pages/dashboard/customer/Recommendations";
import ChatLists from "./pages/dashboard/customer/ChatLists";
import GroupChat from "./pages/dashboard/customer/GroupChat";
import NotificationPrompt from "./components/notification/NotificationPrompt";
import useFCM from "./services/useFCM";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import OAuthCallback from "./components/OAuthCallback";
import CheckoutSuccess from "./components/CheckoutSuccess";
import BooksList from "./pages/dashboard/admin/BooksList";
import MLMSettings from "./pages/dashboard/admin/MLMSettings";
import PostsFeed from "./pages/PostsFeed";
import SinglePostPage from "./pages/SinglePostPage";
import SavedPosts from "./pages/dashboard/SavedPosts";
import SellerDashboardPage from "./pages/dashboard/seller/SellerDashboardPage";
import SellerRegistrationPage from "./pages/auth/SellerRegistrationPage";
import SellerStorefrontPage from "./pages/SellerStorefrontPage";
import FollowPage from "./pages/FollowPage";
import FollowDashboard from "./pages/dashboard/customer/FollowDashboard";
import MyCourses from "./pages/dashboard/customer/MyCourses";
import CourseViewer from "./pages/dashboard/customer/CourseViewer";
import CoursesList from "./pages/dashboard/admin/CoursesList";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogsList from "./pages/dashboard/admin/BlogsList";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import CurrencyInitializer from "./components/common/CurrencyInitializer";

function App() {
  // Initialize FCM and get FCM functionality
  const { isSupported } = useFCM();

  useEffect(() => {
    if (!isSupported) {
      console.log("Push notifications are not supported in this browser");
    }
  }, [isSupported]);

  return (
    <CurrencyInitializer>
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <NotificationPrompt />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
          <Route index element={<HomePage />} />
          <Route path="books" element={<BooksPage />} />
          <Route
            path="feeds"
            element={
              <AuthRoute>
                <PostsFeed />
              </AuthRoute>
            }
          />
          <Route
            path="feeds/:postId"
            element={
              <AuthRoute>
                <SinglePostPage />
              </AuthRoute>
            }
          />

          <Route
            path="users/:userId"
            element={
              <AuthRoute>
                <FollowPage />
              </AuthRoute>
            }
          />

          <Route path="books/:id" element={<BookDetailPage />} />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route
            path="seller/store/:idOrSlug"
            element={<SellerStorefrontPage />}
          />
          <Route path="cart" element={<CartPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:id" element={<BlogDetailPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund" element={<RefundPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />

          {/* Protected Routes */}
          <Route
            path="checkout"
            element={
              <AuthRoute>
                <CheckoutPage />
              </AuthRoute>
            }
          />
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="register" element={<Register />} />
          <Route path="seller/register" element={<SellerRegistrationPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route path="" element={<UserDashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId" element={<GroupChat />} />
          <Route path="followers" element={<FollowDashboard/>} />
          <Route path="chats" element={<ChatLists />} />
          <Route path="saved-posts" element={<SavedPosts />} />
          <Route path="mlm" element={<MLMDashboard />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:courseId" element={<CourseViewer />} />

          <Route path="wishlist" element={<Wishlist />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Seller Routes */}
        <Route
          path="seller"
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route path="index" element={<SellerDashboardPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<BooksList />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="products" element={<BooksList />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="mlm" element={<MLMSettings />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
    </CurrencyInitializer>
  );
}

export default App;
