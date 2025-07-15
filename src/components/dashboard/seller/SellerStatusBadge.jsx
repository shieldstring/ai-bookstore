import React from "react";
import { CheckCircle, Clock, XCircle, Info } from "lucide-react";

// Seller Status Badge Component
const SellerStatusBadge = ({ status }) => {
  let colorClass = "";
  let statusText = "";
  let Icon = Info;

  switch (status) {
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800";
      statusText = "Pending Approval";
      Icon = Clock;
      break;
    case "approved":
      colorClass = "bg-green-100 text-green-800";
      statusText = "Approved";
      Icon = CheckCircle;
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-800";
      statusText = "Rejected";
      Icon = XCircle;
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
      statusText = "Unknown Status";
      Icon = Info;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
    >
      <Icon size={16} /> {statusText}
    </span>
  );
};

export default SellerStatusBadge;
