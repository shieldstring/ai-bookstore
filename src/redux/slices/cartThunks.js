import { addItemToCart, removeItemFromCart, updateItemQuantity, clearLocalCart, syncCartWithServer, applyCoupon } from './cartSlice';
import { CartApiSlice } from './cartApiSlice';
 

export const addToCartWithSync = (product) => async (dispatch, getState) => {
  const { id, quantity = 1 } = product;
  const currentCart = getState().cart;

  try {
    // 1. Optimistic update
    dispatch(addItemToCart(product));
    
    // 2. Server sync
    await CartApiSlice.addToCart(id, quantity);
    
  } catch (error) {
    // 3. Revert on error
    dispatch(syncCartWithServer(currentCart));
    
    throw new Error('Failed to add item to cart. Please try again.');
  }
};

export const updateCartItemWithSync = (itemId, quantity) => async (dispatch, getState) => {
  const currentCart = getState().cart;

  try {
    // Optimistic update
    dispatch(updateItemQuantity({ id: itemId, quantity }));
    
    // Server sync
    await CartApiSlice.updateCartItem(itemId, quantity);
    
  } catch (error) {
    dispatch(syncCartWithServer(currentCart));
    throw new Error('Failed to update item quantity.');
  }
};

export const removeFromCartWithSync = (itemId) => async (dispatch, getState) => {
  const currentCart = getState().cart;

  try {
    // Optimistic update
    dispatch(removeItemFromCart(itemId));
    
    // Server sync
    await CartApiSlice.removeFromCart(itemId);
    
  } catch (error) {
    dispatch(syncCartWithServer(currentCart));
    throw new Error('Failed to remove item from cart.');
  }
};

export const clearCartWithSync = () => async (dispatch, getState) => {
  const currentCart = getState().cart;

  try {
    // Optimistic update
    dispatch(clearLocalCart());
    
    // Server sync
    await CartApiSlice.clearCart();
    
  } catch (error) {
    dispatch(syncCartWithServer(currentCart));
    throw new Error('Failed to clear cart.');
  }
};

export const applyCouponWithSync = (couponCode) => async (dispatch, getState) => {
  const currentCart = getState().cart;

  try {
    // Server validation first
    const response = await CartApiSlice.applyCoupon(couponCode);
    
    // Then update local state
    dispatch(applyCoupon(response.discount));
    
  } catch (error) {
    // No need to revert since we didn't optimistically update
    throw new Error(error.message || 'Invalid coupon code');
  }
};

export const initializeCart = () => async (dispatch, getState) => {
  try {
    const serverCart = await CartApiSlice.getCart();
    dispatch(syncCartWithServer(serverCart));
  } catch (error) {
    console.error('Failed to initialize cart:', error);
    // Start with empty cart if server fails
    dispatch(syncCartWithServer({ 
      items: [], 
      subtotal: 0, 
      tax: 0, 
      shipping: 0, 
      total: 0,
      discount: 0,
      status: 'idle',
      error: null
    }));
    throw new Error('Failed to load your cart. Showing empty cart.');
  }
};

