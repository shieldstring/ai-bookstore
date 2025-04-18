import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { 
  Home, User, ShoppingBag, Heart, BookOpen, 
  Star, BarChart2, Grid, ShoppingCart, 
  Users, PieChart, Settings, Menu, X, LogOut 
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  
  const userNavigation = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'My Account', path: '/dashboard/account', icon: <User className="h-5 w-5" /> },
    { name: 'My Orders', path: '/dashboard/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: <Heart className="h-5 w-5" /> },
    { name: 'Reading Progress', path: '/dashboard/reading-progress', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: <Star className="h-5 w-5" /> },
  ];

  const adminNavigation = [
    { name: 'Store Overview', path: '/admin/overview', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Grid className="h-5 w-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <PieChart className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const navItems = isAdmin ? adminNavigation : userNavigation;

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      className={`${
        location.pathname === item.path
          ? 'bg-purple-100 text-purple-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
    >
      <span className={`${
        location.pathname === item.path ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
      } mr-3`}>
        {item.icon}
      </span>
      {item.name}
    </Link>
  );

  const UserProfile = () => (
    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
      <div className="flex items-center w-full">
        <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">
            {user?.name}
          </p>
          <Link 
            to="/logout" 
            className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
          >
            <LogOut className="h-3 w-3 mr-1" /> Sign out
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden fixed inset-0 flex z-40`}>
        <div className="fixed inset-0 bg-gray-600/75" onClick={() => setMobileMenuOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Clevr" className="h-8" />
                <span className="ml-2 text-xl font-semibold text-purple-700">Clevr</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-4 mb-5">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Clevr" className="h-8" />
                <span className="ml-2 text-xl font-semibold text-purple-700">Clevr</span>
              </Link>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto bg-gray-50">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;