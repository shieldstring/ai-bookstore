import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ error, className = "" }) => {
  const errorMessage =
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "An error occurred";

  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
