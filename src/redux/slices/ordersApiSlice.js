import { apiTwo } from "./apiSlice";

export const ordersApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: "payment/create-payment-intent",
        method: "POST",
        body: amount,
      }),
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrders: builder.query({
      query: () => "orders",
      providesTags: ["Order"],
      transformResponse: (response) => ({
        data: response,
        totalPages: 1, // Adjust if you implement pagination later
      }),
    }),
    getOrderById: builder.query({
      query: (orderId) => `orders/${orderId}`,
      providesTags: (result, error, arg) => [{ type: "Order", id: arg }],
    }),
    getAllOrders: builder.query({
      query: () => "orders/admin/all",
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    handlePaymentWebhook: builder.mutation({
      query: (webhookData) => ({
        url: "payment/webhook",
        method: "POST",
        body: webhookData,
      }),
    }),
    verifyPaymentStatus: builder.query({
      query: (paymentId) => `payment/status/${paymentId}`,
      providesTags: ["Payment"],
    }),
    updateOrderPaymentStatus: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `orders/${orderId}/payment-status`,
        method: "PATCH",
        body: { paymentData },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreateOrderMutation,
  useHandlePaymentWebhookMutation,
  useVerifyPaymentStatusQuery,
  useUpdateOrderPaymentStatusMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} = ordersApiSlice;
