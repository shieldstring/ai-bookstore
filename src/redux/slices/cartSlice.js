import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  coupon: null,
  status: 'idle',
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ... existing reducers ...
    
    applyCoupon: (state, action) => {
      const { code, discount, error } = action.payload;
      state.coupon = {
        code,
        discount,
        error: error || null
      };
      state.discount = discount || 0;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.08;
      state.shipping = state.subtotal > 50 ? 0 : 4.99;
      state.total = (state.subtotal + state.tax + state.shipping) - state.discount;
    },
    
    // ... other reducers ...
  }
});

export const { 
  addItemToCart, 
  removeItemFromCart, 
  updateItemQuantity, 
  clearLocalCart,
  syncCartWithServer,
  applyCoupon, // Make sure this is exported
  calculateTotals
} = cartSlice.actions;

export default cartSlice.reducer;