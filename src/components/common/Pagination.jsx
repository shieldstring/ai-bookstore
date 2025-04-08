import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";


export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPaginationRange = () => {
    const delta = 1; // How many pages to show before and after current page
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add ellipses if needed
    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    // Always include first and last page
    if (totalPages > 1) {
      range.unshift(1);
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-2 rounded-full border border-gray-300 hover:text-purple-600 hover:border-purple-600 ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-purple-50 "
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page numbers */}
      {getPaginationRange().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full   hover:border-purple-600 ${
              currentPage === page
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-2 rounded-full border border-gray-300 hover:text-purple-600 hover:border-purple-600 ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-purple-50 "
        }`}
        aria-label="Next page"
        
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
