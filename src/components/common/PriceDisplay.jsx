import React from "react";
import { formatPricePlain, normalizePrice } from "../../utils/currency";

const PriceDisplay = ({ price, originalPrice, size = "md" }) => {
  const normalizedPrice = normalizePrice(price);
  const normalizedOriginal = normalizePrice(originalPrice);
  const hasDiscount = normalizedOriginal > normalizedPrice;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl font-semibold",
  };

  return (
    <div className="flex items-center">
      <span className={`text-purple-700 font-medium ${sizeClasses[size]}`}>
        {formatPricePlain(normalizedPrice)}
      </span>

      {hasDiscount && (
        <span className="text-gray-400 line-through ml-2 text-sm">
          {formatPricePlain(normalizedOriginal)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
