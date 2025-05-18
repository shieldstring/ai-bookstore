import { 
    X, Mail, Calendar, User, CreditCard, Package, Clock, 
    Award, Coins, Gift, Bell, Smartphone, BookOpen, 
    Users as GroupIcon, BarChart2, Phone, Link
  } from "lucide-react";
  
  const CustomerDetailsModal = ({ customer, onClose }) => {
    if (!customer) return null;
  
    const formatDate = (dateString) => {
      if (!dateString) return "Never";
      const date = new Date(dateString);
      return date.toLocaleString();
    };
  
    const renderLoginHistory = () => {
      if (!customer.loginHistory || customer.loginHistory.length === 0) {
        return <p className="text-gray-500">No login history available</p>;
      }
      
      return (
        <div className="max-h-40 overflow-y-auto">
          {customer.loginHistory.map((login, index) => (
            <p key={index} className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0">
              {formatDate(login)}
            </p>
          ))}
        </div>
      );
    };
  
    const renderFcmTokens = () => {
      if (!customer.fcmTokens || customer.fcmTokens.length === 0) {
        return <p className="text-gray-500">No devices registered</p>;
      }
      
      return (
        <div className="max-h-40 overflow-y-auto">
          {customer.fcmTokens.map((token, index) => (
            <div key={index} className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0">
              <p className="font-medium">{token.device}</p>
              <p className="text-xs text-gray-500 truncate">{token.token}</p>
              <p className="text-xs text-gray-400">Last used: {formatDate(token.lastUpdated)}</p>
            </div>
          ))}
        </div>
      );
    };
  
    const renderNotificationPreferences = () => {
      if (!customer.notificationPreferences) return null;
      
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(customer.notificationPreferences)
            .filter(([key]) => key !== "_id")
            .map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={value} 
                  readOnly 
                  className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
        </div>
      );
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                {customer.profilePicture ? (
                  <img 
                    src={customer.profilePicture} 
                    alt={customer.name}
                    className="h-24 w-24 rounded-full object-cover border-2 border-purple-100"
                  />
                ) : (
                  <div className="bg-purple-100 h-24 w-24 rounded-full flex items-center justify-center text-purple-600 text-3xl font-bold">
                    {customer.name.charAt(0)}
                  </div>
                )}
                <span className={`absolute -bottom-2 -right-2 px-2 py-1 text-xs rounded-full ${
                  customer.role === "admin" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {customer.role}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-gray-600">{customer.bio || "No bio provided"}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {formatDate(customer.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last active: {formatDate(customer.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-xs">Level</span>
                </div>
                <p className="text-xl font-bold mt-1">{customer.level || 1}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span className="text-xs">XP</span>
                </div>
                <p className="text-xl font-bold mt-1">{customer.xp || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500">
                  <Coins className="h-4 w-4 mr-2" />
                  <span className="text-xs">Tokens</span>
                </div>
                <p className="text-xl font-bold mt-1">{customer.tokens || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500">
                  <Gift className="h-4 w-4 mr-2" />
                  <span className="text-xs">Earnings</span>
                </div>
                <p className="text-xl font-bold mt-1">${customer.earnings?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
  
            {/* Detailed Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Activity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Account Activity
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Login History</p>
                    {renderLoginHistory()}
                  </div>
                  {customer.referralCode && (
                    <div>
                      <p className="text-sm text-gray-500">Referral Code</p>
                      <div className="flex items-center mt-1">
                        <Link className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {customer.referralCode}
                        </span>
                      </div>
                    </div>
                  )}
                  {customer.referredBy && (
                    <div>
                      <p className="text-sm text-gray-500">Referred By</p>
                      <p className="text-sm mt-1">User ID: {customer.referredBy}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Referral Count</p>
                    <p className="text-sm mt-1">{customer.referralCount || 0} users</p>
                  </div>
                </div>
              </div>
  
              {/* Devices & Notifications */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                  Devices & Notifications
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Registered Devices</p>
                    {renderFcmTokens()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Notification Preferences</p>
                    {renderNotificationPreferences()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unread Notifications</p>
                    <p className="text-sm mt-1">{customer.notificationCount || 0}</p>
                  </div>
                </div>
              </div>
  
              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Additional Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">MLM Tier</p>
                    <p className="text-sm mt-1">{customer.mlmTier || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="text-sm mt-1">{formatDate(customer.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm mt-1">{formatDate(customer.updatedAt)}</p>
                  </div>
                </div>
              </div>
  
              {/* Groups (if available) */}
              {customer.groups && customer.groups.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <GroupIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Group Memberships
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.groups.map((group) => (
                      <span 
                        key={group._id} 
                        className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  
          <div className="border-t p-4 flex justify-end sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CustomerDetailsModal;