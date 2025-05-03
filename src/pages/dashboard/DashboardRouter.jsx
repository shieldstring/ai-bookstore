import { useSelector } from 'react-redux';
import AdminDashboard from './admin/AdminDashboard';
import UserDashboard from './customer/UserDashboard';

const DashboardRouter = () => {
  // Get user role from Redux store
  const { userInfo } = useSelector(state => state.auth);
  
  // Render admin or user dashboard based on role
  return userInfo?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardRouter;