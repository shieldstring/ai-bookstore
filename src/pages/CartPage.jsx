import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  applyCoupon 
} from '../../features/cart/cartSlice';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, status, error, coupon } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(applyCoupon(couponCode));
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
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
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
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