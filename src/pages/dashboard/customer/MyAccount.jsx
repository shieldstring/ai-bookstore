import { useState } from "react";
import { User, Mail, Lock, CreditCard, MapPin, Plus, Trash2, Edit, X } from "lucide-react";
import { useSelector } from "react-redux";
import SEO from "../../../components/SEO";

const MyAccount = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Add password change logic here
    setShowPasswordModal(false);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    // Add payment method logic here
    setShowPaymentModal(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    // Add address logic here
    setShowAddressModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <SEO
        title="Account Settings"
        description="Manage your personal information, security settings, payment methods, and shipping addresses."
        name="AI-Powered Social-Ecommerce"
        type="settings"
      />
      
      <div className="full mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                <p className="text-purple-100">{userInfo.email}</p>
                <p className="text-sm text-purple-100 mt-1">
                  Member since {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {['Personal', 'Security', 'Payments', 'Addresses'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab.toLowerCase() 
                      ? 'border-purple-600 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-8">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      defaultValue={userInfo.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-300">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{userInfo.email}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      defaultValue={userInfo.phone || ''}
                      placeholder="Add phone number"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="text-lg font-medium">Security</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Password</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Last changed {userInfo.passwordUpdatedAt ? new Date(userInfo.passwordUpdatedAt).toLocaleDateString() : 'never'}
                    </p>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {userInfo.twoFactorEnabled ? 'Enabled' : 'Not set up'}
                    </p>
                    <button
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      {userInfo.twoFactorEnabled ? 'Manage' : 'Set up'} 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Payment Method
                  </button>
                </div>
                
                {userInfo.paymentMethods?.length > 0 ? (
                  <div className="space-y-3">
                    {userInfo.paymentMethods.map((method) => (
                      <div key={method.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">
                              {method.brand} ending in {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.exp_month}/{method.exp_year}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <CreditCard className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-3 text-gray-500">No payment methods saved</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add a payment method to make purchases faster
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium">Address Book</h3>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add New Address
                  </button>
                </div>
                
                {userInfo.addresses?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInfo.addresses.map((address) => (
                      <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {address.label || 'Primary Address'}
                            {address.isDefault && (
                              <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </h4>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-purple-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            {!address.isDefault && (
                              <button className="text-gray-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {address.street}<br />
                          {address.city}, {address.state} {address.postalCode}<br />
                          {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <MapPin className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-3 text-gray-500">No saved addresses</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add an address for faster checkout
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={addressDetails.street}
                  onChange={(e) => setAddressDetails({...addressDetails, street: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={addressDetails.city}
                    onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={addressDetails.state}
                    onChange={(e) => setAddressDetails({...addressDetails, state: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={addressDetails.postalCode}
                    onChange={(e) => setAddressDetails({...addressDetails, postalCode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={addressDetails.country}
                    onChange={(e) => setAddressDetails({...addressDetails, country: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  checked={addressDetails.isDefault}
                  onChange={(e) => setAddressDetails({...addressDetails, isDefault: e.target.checked})}
                />
                <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;