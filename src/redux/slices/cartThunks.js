import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearLocalCart,
  syncCartWithServer,
  applyCoupon,
  setLoggedIn,
  setLoggedOut
} from "./cartSlice";
import { CartApiSlice } from "./cartApiSlice";

// Helper to check login status
const isUserLoggedIn = (getState) => {
  // You can adjust this based on how you track authentication in your app
  // This checks both the auth state (if you have an auth slice) or the cart's internal tracking
  return getState().auth?.isAuthenticated || getState().cart?.isLoggedIn || false;
};

export const addToCartWithSync = (product) => async (dispatch, getState) => {
  const { bookId, quantity } = product;
  
  // Always update local cart first
  dispatch(addItemToCart(product));
  
  // Only sync with server if logged in
  if (isUserLoggedIn(getState)) {
    try {
      await CartApiSlice.addToCart(bookId, quantity);
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
      // We don't revert the local update since the local change is valid
      // and we'll sync again later
    }
  }
};

export const updateCartItemWithSync = (itemId, quantity) => async (dispatch, getState) => {
  // Always update local cart
  dispatch(updateItemQuantity({ id: itemId, quantity }));
  
  // Only sync with server if logged in
  if (isUserLoggedIn(getState)) {
    try {
      await CartApiSlice.updateCartItem(itemId, quantity);
    } catch (error) {
      console.error("Failed to sync cart update with server:", error);
    }
  }
};

export const removeFromCartWithSync = (itemId) => async (dispatch, getState) => {
  // Always update local cart
  dispatch(removeItemFromCart(itemId));
  
  // Only sync with server if logged in
  if (isUserLoggedIn(getState)) {
    try {
      await CartApiSlice.removeFromCart(itemId);
    } catch (error) {
      console.error("Failed to sync item removal with server:", error);
    }
  }
};

export const clearCartWithSync = () => async (dispatch, getState) => {
  // Always clear local cart
  dispatch(clearLocalCart());
  
  // Only sync with server if logged in
  if (isUserLoggedIn(getState)) {
    try {
      await CartApiSlice.clearCart();
    } catch (error) {
      console.error("Failed to sync cart clearing with server:", error);
    }
  }
};

export const applyCouponWithSync = (couponCode) => async (dispatch, getState) => {
  // For coupons, we need server validation even for local cart
  if (isUserLoggedIn(getState)) {
    try {
      const response = await CartApiSlice.applyCoupon(couponCode);
      dispatch(applyCoupon({
        code: couponCode,
        discount: response.discount || 0,
        error: null
      }));
    } catch (error) {
      // For coupon errors, update the local state with the error
      dispatch(applyCoupon({
        code: couponCode,
        discount: 0,
        error: error.message || "Invalid coupon code"
      }));
      throw new Error(error.message || "Invalid coupon code");
    }
  } else {
    // For guest users, maybe implement simple validation or prevent coupon usage
    dispatch(applyCoupon({
      code: couponCode,
      discount: 0,
      error: "Please log in to apply coupon codes"
    }));
    throw new Error("Please log in to apply coupon codes");
  }
};

export const initializeCart = () => async (dispatch, getState) => {
  // For logged-in users, fetch from server
  if (isUserLoggedIn(getState)) {
    try {
      const serverCart = await CartApiSlice.getCart();
      dispatch(syncCartWithServer(serverCart));
    } catch (error) {
      console.error("Failed to fetch cart from server:", error);
      // Don't throw error - we'll use local cart from localStorage
    }
  }
  // For guests, the cart is already loaded from localStorage via the Redux store
};

// Call this when user logs in
export const handleLoginSuccess = () => async (dispatch, getState) => {
  // Mark the cart as logged in
  dispatch(setLoggedIn());
  
  // Get the local cart before syncing
  const localCart = getState().cart;
  
  try {
    // If there are items in the local cart, add them to the server cart one by one
    if (localCart.items.length > 0) {
      // First get the server cart to see what's already there
      const serverCart = await CartApiSlice.getCart();
      const serverItemIds = serverCart.items.map(item => item.id);
      
      // Add each local item to server if it's not already there
      for (const item of localCart.items) {
        if (!serverItemIds.includes(item.id)) {
          await CartApiSlice.addToCart(item.bookId || item.id, item.quantity);
        } else {
          // If item exists, update quantity instead
          const existingItem = serverCart.items.find(i => i.id === item.id);
          const newQuantity = existingItem.quantity + item.quantity;
          await CartApiSlice.updateCartItem(item.id, newQuantity);
        }
      }
    }
    
    // Finally get the updated cart from server
    const updatedServerCart = await CartApiSlice.getCart();
    dispatch(syncCartWithServer(updatedServerCart));
    
  } catch (error) {
    console.error("Failed to sync cart on login:", error);
    // If sync fails, we'll keep the local cart
  }
};

// Call this when user logs out
export const handleLogout = () => (dispatch) => {
  // Mark the cart as logged out and save to localStorage
  dispatch(setLoggedOut());
  
  // Don't clear the cart - we want to keep items for guest shopping
};