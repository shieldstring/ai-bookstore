import { apiTwo } from "./apiSlice";

export const CartApiSlice = {
  addToCart: async (bookId, quantity) => {
    const response = await dispatch(
      apiTwo.endpoints.addToCart.initiate({ bookId, quantity })
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  updateCartItem: async (bookId, quantity) => {
    const response = await dispatch(
      apiTwo.endpoints.updateCartItem.initiate({ bookId, quantity })
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await dispatch(
      apiTwo.endpoints.removeFromCart.initiate(itemId)
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  clearCart: async () => {
    const response = await dispatch(apiTwo.endpoints.clearCart.initiate());
    if ("error" in response) throw response.error;
    return response.data;
  },

  getCart: async () => {
    const response = await dispatch(apiTwo.endpoints.getCart.initiate());
    if ("error" in response) throw response.error;
    return response.data;
  },
  applyCoupon: async (couponCode) => {
    const response = await dispatch(
      apiTwo.endpoints.applyCoupon.initiate({ couponCode })
    );
    if ("error" in response) throw response.error;
    return response.data;
  },
};

// Store dispatch reference (set this during store initialization)
let dispatch;
export const setCartApiDispatch = (storeDispatch) => {
  dispatch = storeDispatch;
};
