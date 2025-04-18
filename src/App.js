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
import Dashboard from "./pages/dashboard/Index";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardRouter from "./pages/dashboard/DashboardRouter";


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
          <Route path="profile/:userId" element={"<UserProfile />"} />
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="social" element={"<SocialFeed />"} />
          <Route path="groups/create" element={"<CreateGroup />"} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="mlm" element={"<MLMDashboard />"} />
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
          </Route>
          <Route path="/" element={
          <DashboardRouter />
        } />
      </Routes>
    </Router>
  );
}

export default App;
