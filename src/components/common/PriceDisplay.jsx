import React from "react";
import useCurrency from "../../hooks/useCurrency";

const PriceDisplay = ({ price, originalPrice, size = "md", priceIsConverted = false }) => {
  const { formatPlain } = useCurrency();
  const hasDiscount =
    originalPrice != null &&
    Number(originalPrice) > Number(price);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl font-semibold",
  };

  return (
    <div className="flex items-center">
      <span className={`text-purple-700 font-medium ${sizeClasses[size]}`}>
        {formatPlain(price, { priceIsConverted })}
      </span>

      {hasDiscount && (
        <span className="text-gray-400 line-through ml-2 text-sm">
          {formatPlain(originalPrice, { priceIsConverted })}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
