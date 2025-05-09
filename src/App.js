import React from "react";
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
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import Wishlist from "./pages/dashboard/customer/Wishlist";
import MyOrders from "./pages/dashboard/customer/MyOrders";
import MyAccount from "./pages/dashboard/customer/MyAccount";
import MLMDashboard from "./pages/dashboard/customer/MLMDashboard";
import SocialFeed from "./pages/dashboard/customer/SocialFeed";
import Groups from "./pages/dashboard/customer/Groups";
import Analytics from "./pages/dashboard/admin/Analytics";
import Customers from "./pages/dashboard/admin/Customers";
import AdminOrders from "./pages/dashboard/admin/Orders";
import AdminSettings from "./pages/dashboard/admin/Settings";
import ProductsList from "./pages/dashboard/admin/ProductsList";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/dashboard/customer/UserDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Recommendations from "./pages/dashboard/customer/Recommendations";

import ChatLists from "./pages/dashboard/customer/ChatLists";
import GroupChat from "./pages/dashboard/customer/GroupChat";
import NotificationPrompt from "./components/notification/NotificationPrompt";
import useFCM from "./services/useFCM";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
function App() {
  useFCM(); // Initialize FCM
  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful:", registration);
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed:", err);
        });
    });
  }

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
          <Route path="books/:id" element={<BookDetailPage />} />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route path="groups/:groupId" element={"<GroupPage />"} />
          <Route path="cart" element={<CartPage />} />

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
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            </AuthRoute>
          }
        /> */}

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
        <Route path="admin" element={<DashboardLayout />}>
          <Route
            path="overview"
            element={
              <AuthRoute>
                <AdminDashboard />
              </AuthRoute>
            }
          />
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="products" element={<ProductsList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
