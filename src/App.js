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

function App() {
  return (
    <Router>
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
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }
        >
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route path="/" element={<DashboardRouter />} />
          <Route path="groups" element={<Groups />} />
          <Route path="social" element={<SocialFeed />} />
          <Route path="mlm" element={<MLMDashboard />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route path="overview" element={<DashboardRouter />} />
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
