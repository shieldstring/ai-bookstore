import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Store,
  Calendar,
  MoreVertical,
  DollarSign,
  Package,
  ShoppingCart,
  Loader2,
} from "lucide-react";

const SellerCard = ({
  seller,
  isPending = false,
  onApprove,
  onReject,
  onDelete,
  approvingLoading = false,
  rejectingLoading = false,
  deletingLoading = false,
}) => {
  const isLoading = approvingLoading || rejectingLoading || deletingLoading;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
            {seller.logo ? (
              <img
                src={seller.logo}
                alt={seller.storeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{seller.storeName}</h3>
            <p className="text-sm text-gray-600">{seller.user?.name || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {seller.user?.email || "N/A"}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {seller.user?.phone || "N/A"}
        </div>
        {seller.user?.address && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {seller.user.address}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Registered: {new Date(seller.createdAt).toLocaleDateString()}
        </div>
        {seller.bio && (
          <div className="text-sm text-gray-600 mt-2">
            <p className="line-clamp-2">{seller.bio}</p>
          </div>
        )}
        {!isPending && seller.analytics && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <p className="text-sm font-medium">
                ${seller.analytics.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <ShoppingCart className="w-3 h-3 text-blue-500 mr-1" />
                <span className="text-xs text-gray-500">Orders</span>
              </div>
              <p className="text-sm font-medium">
                {seller.analytics.totalOrders || 0}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Package className="w-3 h-3 text-purple-500 mr-1" />
                <span className="text-xs text-gray-500">Products</span>
              </div>
              <p className="text-sm font-medium">
                {seller.analytics.totalProducts || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {isPending ? (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onApprove(seller._id)}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {approvingLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject(seller._id)}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {rejectingLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Approved
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(seller._id)}
              disabled={isLoading}
              className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {deletingLoading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Remove
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

SellerCard.propTypes = {
  seller: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    storeName: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    }),
    logo: PropTypes.string,
    bio: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    analytics: PropTypes.shape({
      totalRevenue: PropTypes.number,
      totalOrders: PropTypes.number,
      totalProducts: PropTypes.number,
    }),
  }).isRequired,
  isPending: PropTypes.bool,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onDelete: PropTypes.func,
  approvingLoading: PropTypes.bool,
  rejectingLoading: PropTypes.bool,
  deletingLoading: PropTypes.bool,
};

SellerCard.defaultProps = {
  isPending: false,
  onApprove: () => {},
  onReject: () => {},
  onDelete: () => {},
  approvingLoading: false,
  rejectingLoading: false,
  deletingLoading: false,
};

export default SellerCard;