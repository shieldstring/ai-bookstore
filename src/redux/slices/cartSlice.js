import { createSlice } from '@reduxjs/toolkit';
import { calculateCartTotals } from '../../utils/cartUtils';

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
    // Client-side only actions for optimistic UI
    addItemToCart: (state, action) => {
      const { id, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }
      
      calculateCartTotals(state);
      state.lastUpdated = Date.now();
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateCartTotals(state);
      state.lastUpdated = Date.now();
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
      }
      
      calculateCartTotals(state);
      state.lastUpdated = Date.now();
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.lastUpdated = Date.now();
    },
    syncCartWithServer: (state, action) => {
      state.items = action.payload.items || [];
      calculateCartTotals(state);
      state.lastUpdated = Date.now();
    },
    
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