import { cartServerSlice } from "./cartServerSlice";

export const CartApiSlice = {
  addToCart: async (bookId, quantity) => {
    const response = await dispatch(
      cartServerSlice.endpoints.addToCart.initiate({ bookId, quantity })
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  updateCartItem: async (bookId, quantity) => {
    const response = await dispatch(
      cartServerSlice.endpoints.updateCartItem.initiate({ bookId, quantity })
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await dispatch(
      cartServerSlice.endpoints.removeFromCart.initiate(itemId)
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  clearCart: async () => {
    const response = await dispatch(
      cartServerSlice.endpoints.clearCart.initiate()
    );
    if ("error" in response) throw response.error;
    return response.data;
  },

  getCart: async () => {
    const response = await dispatch(
      cartServerSlice.endpoints.getCart.initiate()
    );
    if ("error" in response) throw response.error;
    return response.data;
  },
  applyCoupon: async (couponCode) => {
    const response = await dispatch(
      cartServerSlice.endpoints.applyCoupon.initiate({ couponCode })
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
