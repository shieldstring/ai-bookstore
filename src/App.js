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
function App() {
  // Initialize FCM and get FCM functionality
  const { isSupported } = useFCM();

  useEffect(() => {
    if (!isSupported) {
      console.log("Push notifications are not supported in this browser");
    }
  }, [isSupported]);

  return (
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
          <Route path="feeds" element={<PostsFeed />} />
          <Route path="feeds/:id" element={<PostsFeed />} />
          <Route path="books/:id" element={<BookDetailPage />} />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route path="groups/:groupId" element={"<GroupPage />"} />
          <Route path="cart" element={<CartPage />} />
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
          <Route path="chats" element={<ChatLists />} />
          <Route path="social" element={"<SocialFeed />"} />
          <Route path="mlm" element={<MLMDashboard />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="recommendations" element={<Recommendations />} />
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
          <Route path="mlm" element={<MLMSettings />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
