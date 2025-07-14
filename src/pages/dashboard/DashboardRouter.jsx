import { useSelector } from "react-redux";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./customer/UserDashboard";
import SellerDashboard from "./seller/SellerDashboardPage";

const DashboardRouter = () => {
  // Get user role from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Render dashboard based on user role
  if (userInfo?.role === "admin") {
    return <AdminDashboard />;
  } else if (userInfo?.role === "seller") {
    return <SellerDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default DashboardRouter;
