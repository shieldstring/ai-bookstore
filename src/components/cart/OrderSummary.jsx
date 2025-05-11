import React from "react";
import { Link } from "react-router-dom";

const OrderSummary = ({ subtotal, discount, total, coupon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 my-3"></div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {coupon?.error && (
        <div className="mt-4 text-red-500 text-sm">{coupon.error}</div>
      )}

      {coupon?.code && !coupon.error && (
        <div className="mt-4 text-green-600 text-sm">
          Coupon applied: {coupon.code}
        </div>
      )}

      <Link
        to="/login?redirect=/checkout"
        className="block w-full bg-purple-600 text-white text-center py-3 rounded-md mt-6 hover:bg-purple-700 transition"
      >
        Proceed to Checkout
      </Link>
      <Link
        to="/books"
        className="block w-full border border-purple-600 text-purple-600 text-center py-3 rounded-md mt-6 hover:text-purple-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSummary;
