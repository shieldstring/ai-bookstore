import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  syncCartWithServer
} from '../redux/slices/cartApiSlice';
import { 
  addToCartWithSync,
  removeFromCartWithSync,
  updateCartItemWithSync,
  clearCartWithSync,
  initializeCart,
  applyCouponWithSync
} from '../redux/slices/cartThunks';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, coupon, status, error: cartError } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [localError, setLocalError] = useState(null);

  // Initialize cart on mount
  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeCart()).unwrap();
      } catch (error) {
        setLocalError(error.message || 'Failed to load cart');
      }
    };
    init();
  }, [dispatch]);

  const handleAddItem = async (product) => {
    try {
      await dispatch(addToCartWithSync(product)).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Failed to add item to cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCartWithSync(itemId)).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await dispatch(updateCartItemWithSync(itemId, newQuantity)).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Failed to update quantity');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartWithSync()).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Failed to clear cart');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      await dispatch(applyCouponWithSync(couponCode)).unwrap();
      setCouponCode('');
    } catch (err) {
      setLocalError(err.message || 'Failed to apply coupon');
    }
  };

  // Combine errors from Redux state and local component
  const error = cartError || localError;

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {error && (
        <ErrorMessage 
          error={error} 
          onClose={() => {
            setLocalError(null);
            // Clear Redux error if needed
            if (cartError) dispatch(syncCartWithServer(cart));
          }} 
        />
      )}

      {cart?.items?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="mb-4">Browse our collection to find your next read</p>
          <Link 
            to="/books" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="divide-y">
                {cart?.items?.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onQuantityChange={(newQuantity) => handleUpdateQuantity(item._id, newQuantity)}
                    onRemove={() => handleRemoveItem(item._id)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <OrderSummary 
              subtotal={cart?.subtotal || 0}
              discount={cart?.discount || 0}
              total={cart?.total || 0}
              coupon={coupon}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h3 className="text-lg font-semibold mb-3">Apply Coupon</h3>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                  disabled={!couponCode.trim()}
                >
                  Apply
                </button>
              </div>
              {coupon?.error && (
                <p className="text-red-500 mt-2">{coupon.error}</p>
              )}
            </div>
            
            <Link
              to="/checkout"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-md mt-6 hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;