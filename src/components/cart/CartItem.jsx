import React from 'react';
import { Trash2 } from "lucide-react";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="border-b py-4 grid grid-cols-6 sm:grid-cols-12 gap-4 items-center">
      <div className="col-span-1">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-20 object-cover rounded"
          />
        ) : (
          <div className="bg-purple-200 w-16 h-20 rounded flex items-center justify-center text-purple-800 text-xs p-2 text-center">
            {item.name.substring(0, 15)}...
          </div>
        )}
      </div>

      <div className="col-span-5">
        <div className="text-xs text-gray-500">SKU {item.sku || 'N/A'}</div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-500">{item.author || 'Unknown Author'}</div>
      </div>

      <div className="col-span-2 flex items-center justify-center">
        <button
          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
          onClick={() => onQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-3 py-1 bg-gray-100">
          {item.quantity}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
          onClick={() => onQuantityChange(item.quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="col-span-2 text-center">
        ${item.price.toFixed(2)}
      </div>

      <div className="col-span-1 text-center">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <div className="col-span-1 text-center">
        <button
          className="text-gray-500 hover:text-red-500"
          onClick={() => onRemove(item._id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;