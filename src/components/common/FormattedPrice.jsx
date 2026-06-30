import React from "react";
import useCurrency from "../../hooks/useCurrency";

const FormattedPrice = ({ price, originalPrice, className = "", priceIsConverted = false }) => {
  const { formatPlain } = useCurrency();

  if (originalPrice != null && Number(originalPrice) > Number(price)) {
    return (
      <span className={className}>
        <span>{formatPlain(price, { priceIsConverted })}</span>
        <span className="text-gray-400 line-through ml-2 text-sm">
          {formatPlain(originalPrice, { priceIsConverted })}
        </span>
      </span>
    );
  }

  return <span className={className}>{formatPlain(price, { priceIsConverted })}</span>;
};

export default FormattedPrice;
