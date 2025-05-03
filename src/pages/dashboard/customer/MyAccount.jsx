import { User, Mail, Lock, CreditCard, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import SEO from "../../../components/SEO";
import { useEffect } from "react";

const MyAccount = () => {
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div className="space-y-6">
      <SEO
        title="Settings"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Account Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  defaultValue={userInfo.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{userInfo.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Password & Security</h3>
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
              Change Password
            </button>
          </div>

          {/* Payment Methods */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Payment Methods</h3>
            </div>
            {/* Payment cards list */}
          </div>

          {/* Address */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Address Book</h3>
            </div>
            {/* Address list */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
