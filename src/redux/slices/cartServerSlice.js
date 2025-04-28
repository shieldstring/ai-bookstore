import { apiTwo } from "./apiSlice";

export const cartServerSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "cart",
    }),
    addToCart: builder.mutation({
      query: ({ bookId, quantity }) => ({
        url: "cart/add",
        method: "POST",
        body: { bookId, quantity },
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `cart/update/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `cart/remove/${itemId}`,
        method: "DELETE",
      }),
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "cart/clear",
        method: "DELETE",
      }),
    }),
    applyCoupon: builder.mutation({
      query: ({ couponCode }) => ({
        url: "cart/coupon",
        method: "POST",
        body: { couponCode },
      }),
    }),
  }),
});

export const {
  useAddToCartMutation,
  useApplyCouponMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} = cartServerSlice;
