import { Settings, Mail, Lock, CreditCard, Globe } from 'lucide-react';
import NotificationSettings from '../../../components/dashboard/NotificationSettings';

const AdminSettings = () => {
  const settingsSections = [
    {
      title: "General Settings",
      icon: <Settings className="h-5 w-5 text-purple-500" />,
      items: ["Store Information", "Localization", "Store Currency"]
    },
    {
      title: "Email Settings",
      icon: <Mail className="h-5 w-5 text-purple-500" />,
      items: ["Email Templates", "SMTP Configuration", "Notification Preferences"]
    },
    {
      title: "Security",
      icon: <Lock className="h-5 w-5 text-purple-500" />,
      items: ["Password Policies", "Two-Factor Authentication", "API Access"]
    },
    {
      title: "Payment Methods",
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      items: ["Credit Card", "PayPal", "Bank Transfer"]
    },
    {
      title: "Shipping & Tax",
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      items: ["Shipping Zones", "Tax Rates", "Packaging"]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Store Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                {section.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600 hover:text-purple-600 cursor-pointer">
                  <span className="mr-2">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <NotificationSettings />
    </div>
  );
};

export default AdminSettings;