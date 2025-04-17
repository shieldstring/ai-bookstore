import { apiSlice } from '../../apiSlice';

export const CartApiSlice = {
  addToCart: async (productId, quantity) => {
    const response = await dispatch(
      apiSlice.endpoints.addToCart.initiate({ productId, quantity })
    );
    if ('error' in response) throw response.error;
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await dispatch(
      apiSlice.endpoints.updateCartItem.initiate({ itemId, quantity })
    );
    if ('error' in response) throw response.error;
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await dispatch(
      apiSlice.endpoints.removeFromCart.initiate(itemId)
    );
    if ('error' in response) throw response.error;
    return response.data;
  },

  clearCart: async () => {
    const response = await dispatch(
      apiSlice.endpoints.clearCart.initiate()
    );
    if ('error' in response) throw response.error;
    return response.data;
  },

  getCart: async () => {
    const response = await dispatch(
      apiSlice.endpoints.getCart.initiate()
    );
    if ('error' in response) throw response.error;
    return response.data;
  },
  applyCoupon: async (couponCode) => {
    const response = await dispatch(
      apiSlice.endpoints.applyCoupon.initiate({ couponCode })
    );
    if ('error' in response) throw response.error;
    return response.data;
  },
};

// Store dispatch reference (set this during store initialization)
let dispatch;
export const setCartApiDispatch = (storeDispatch) => {
  dispatch = storeDispatch;
};