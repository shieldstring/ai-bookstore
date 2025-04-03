import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import bookReducer from './slices/bookSlice';
// import cartReducer from './slices/cartSlice';

const store = configureStore({
   reducer: {
      // books: bookReducer,
      // cart: cartReducer,
      // auth: authReducer,
    },
});

export default store;