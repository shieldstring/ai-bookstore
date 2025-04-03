import React from 'react';

const PriceDisplay = ({ price, originalPrice, size = 'md' }) => {
  const hasDiscount = originalPrice && originalPrice > price;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl font-semibold'
  };
  
  return (
    <div className="flex items-center">
      <span className={`text-purple-700 font-medium ${sizeClasses[size]}`}>${price.toFixed(2)}</span>
      
      {hasDiscount && (
        <span className="text-gray-400 line-through ml-2 text-sm">
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;