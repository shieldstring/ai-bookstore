import React from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorMessage = ({ error, className = "" }) => {
  const errorMessage =
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "An error occurred";

  return (
    <div className={` flex items-center justify-center bg-gray-50 p-4 ${className}`}>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl w-full">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Something went wrong!</h3>
            <p className="text-sm text-red-700 mb-4">
              {errorMessage}
            </p>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Our team has been notified and
              we're working to fix this issue.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 border border-red-200"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 border border-gray-200"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;