import { configureStore } from "@reduxjs/toolkit";
import { apiOne, apiTwo } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import { setCartApiDispatch } from "./slices/cartApiSlice";
import notificationReducer from "./slices/notificationSlice";
import { notificationApiSlice } from "./slices/notificationSlice";
export const store = configureStore({
  reducer: {
    [apiOne.reducerPath]: apiOne.reducer,
    [apiTwo.reducerPath]: apiTwo.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,

    auth: authReducer,
    cart: cartReducer,
    notification: notificationReducer,
  },

  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware().concat([apiTwo.middleware, apiOne.middleware]),
});

// Inject store dispatch into cart service
setCartApiDispatch(store.dispatch);

export default store;
