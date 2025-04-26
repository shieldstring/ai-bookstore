import { createSlice } from "@reduxjs/toolkit";
import { calculateCartTotals } from "../../utils/cartUtils";

// Load initial state from localStorage if available
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("guestCart");
    return savedCart
      ? JSON.parse(savedCart)
      : {
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          coupon: null,
          status: "idle",
          error: null,
        };
  } catch (e) {
    console.error("Error loading cart from storage:", e);
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      coupon: null,
      status: "idle",
      error: null,
    };
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem("guestCart", JSON.stringify(cartState));
  } catch (e) {
    console.error("Error saving cart to storage:", e);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    // Client-side only actions for optimistic UI
    addItemToCart: (state, action) => {
      const { bookId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === bookId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: bookId, // Store bookId as id in cart items for consistency
          bookId, // Also keep bookId explicitly for API operations
          ...action.payload,
          quantity,
        });
      }

      calculateCartTotals(state);
      state.lastUpdated = Date.now();
      saveCartToStorage(state);
    },

    removeItemFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      calculateCartTotals(state);
      state.lastUpdated = Date.now();
      saveCartToStorage(state);
    },

    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
      }

      calculateCartTotals(state);
      state.lastUpdated = Date.now();
      saveCartToStorage(state);
    },

    clearLocalCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.discount = 0;
      state.coupon = null;
      state.lastUpdated = Date.now();
      localStorage.removeItem("guestCart");
    },

    syncCartWithServer: (state, action) => {
      // If server provides items, use them
      if (action.payload && action.payload.items) {
        state.items = action.payload.items;
        calculateCartTotals(state);
      }

      // Copy any other fields from server
      if (action.payload) {
        if (action.payload.coupon) state.coupon = action.payload.coupon;
        if (action.payload.discount !== undefined)
          state.discount = action.payload.discount;
      }

      state.lastUpdated = Date.now();
      saveCartToStorage(state);
    },

    applyCoupon: (state, action) => {
      const { code, discount, error } = action.payload;
      state.coupon = {
        code,
        discount,
        error: error || null,
      };
      state.discount = discount || 0;
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },

    calculateTotals: (state) => {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.tax = state.subtotal * 0.08;
      state.shipping = state.subtotal > 50 ? 0 : 4.99;
      state.total =
        state.subtotal + state.tax + state.shipping - state.discount;
    },

    // For tracking login state within cart (optional)
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
    },

    setLoggedOut: (state, action) => {
      state.isLoggedIn = false;
      saveCartToStorage(state);
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearLocalCart,
  syncCartWithServer,
  applyCoupon,
  calculateTotals,
  setLoggedIn,
  setLoggedOut,
} = cartSlice.actions;

export default cartSlice.reducer;
