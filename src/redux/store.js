import { configureStore } from "@reduxjs/toolkit";
import { apiOne, apiTwo } from "../Slices/apiSlice";
import authReducer from "../Slices/authSlice";
import cartReducer from '../Slices/cartSlice';
import { setCartApiDispatch } from '../Slices/cartSlice';

export const store = configureStore({
  reducer: {
    [apiOne.reducerPath]: apiOne.reducer,
    [apiTwo.reducerPath]: apiTwo.reducer,

    auth: authReducer,
    cart: cartReducer,
  },

  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware().concat([apiTwo.middleware, apiOne.middleware]),
});

// Inject store dispatch into cart service
setCartApiDispatch(store.dispatch);

export default store;