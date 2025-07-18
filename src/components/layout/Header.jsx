import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { User, Menu, X } from "lucide-react";
import { handleLogout } from "../../redux/slices/cartThunks";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize search query from URL when component mounts or location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Clear other filters when doing a new search
    navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}&page=1`);
    setSearchQuery(""); // Clear the input after search
  };

  const handleUserLogout = () => {
    dispatch(logout());
    dispatch(handleLogout());
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="md:hidden mr-2" onClick={toggleSidebar}>
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            <Link to="/" className="flex items-center">
              <div className="font-bold text-xl text-purple-700">Book</div>
              <div className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                Store
              </div>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-x-3 w-[40rem]">
            <button
              className="hidden md:flex items-center gap-x-1 text-[#8D27AE] font-semibold"
              onClick={toggleSidebar}
            >
              Menu
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-lg hidden md:block"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find books here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-4">
            <Link to="/cart" className="relative p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 hover:text-purple-600 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 border border-purple-600 rounded hover:bg-purple-50 transition">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {userInfo?.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {userInfo.role === "admin" ? (
                  <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-[100]">
                    <Link
                      to="/admin/analytics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Analytics
                    </Link>

                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/customers"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Customers
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Products
                    </Link>

                    <button
                      onClick={handleUserLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-[100]">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/dashboard/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/dashboard/mlm"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      My Network
                    </Link>
                    <Link
                      to="/feeds"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      My Feeds
                    </Link>

                    <Link
                      to="/dashboard/saved-posts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Saved Posts
                    </Link>
                    <button
                      onClick={handleUserLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="w-20 lg:w-fit text-center py-2 px-2 sm:px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search form */}
        <form onSubmit={handleSearch} className="flex-1 mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Find books here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Navigation */}
      {sidebarOpen && (
        <nav className="bg-[#8D27AE] hidden md:block py-3">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-6 py-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `font-semibold   ${
                      isActive
                        ? " text-[#fce7f3]"
                        : "text-gray-100 hover:text-[#fce7f3]"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/books"
                  className={({ isActive }) =>
                    `font-semibold   ${
                      isActive
                        ? " text-[#fce7f3]"
                        : "text-gray-100 hover:text-[#fce7f3]"
                    }`
                  }
                >
                  Books
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `font-semibold   ${
                      isActive
                        ? " text-[#fce7f3]"
                        : "text-gray-100 hover:text-[#fce7f3]"
                    }`
                  }
                >
                  Categories
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login?redirect=/dashboard/recommendations"
                  className={({ isActive }) =>
                    `font-semibold   ${
                      isActive
                        ? " text-[#fce7f3]"
                        : "text-gray-100 hover:text-[#fce7f3]"
                    }`
                  }
                >
                  Recommendations
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login?redirect=/feeds"
                  className={({ isActive }) =>
                    `font-semibold   ${
                      isActive
                        ? " text-[#fce7f3]"
                        : "text-gray-100 hover:text-[#fce7f3]"
                    }`
                  }
                >
                  Feeds
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="font-bold text-xl text-purple-700">Bookstore</div>
              <button onClick={toggleSidebar}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="block py-2 text-gray-800 hover:text-purple-700"
                  onClick={toggleSidebar}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="block py-2 text-gray-800 hover:text-purple-700"
                  onClick={toggleSidebar}
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="block py-2 text-gray-800 hover:text-purple-700"
                  onClick={toggleSidebar}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/login?redirect=/dashboard/recommendations"
                  className="block py-2 text-gray-800 hover:text-purple-700"
                  onClick={toggleSidebar}
                >
                  Recommendations
                </Link>
              </li>

              <li>
                <Link
                  to="/login?redirect=/feeds"
                  className="block py-2 text-gray-800 hover:text-purple-700"
                  onClick={toggleSidebar}
                >
                  Feeds
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="block py-2 text-center rounded-lg text-gray-100 bg-purple-600 hover:b-purple-700"
                  onClick={toggleSidebar}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
