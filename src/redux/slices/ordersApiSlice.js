import { apiTwo } from "./apiSlice";

export const ordersApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "payment/create-checkout-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "Cart", "Book"],
    }),

    getOrders: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `orders?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Order", id: _id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      transformResponse: (response) => ({
        data: response.orders,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalOrders: response.totalOrders,
      }),
    }),

    getOrderById: builder.query({
      query: (orderId) => `orders/${orderId}`,
      providesTags: (result, error, arg) => [{ type: "Order", id: arg }],
    }),

    getAllOrders: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
        sortField = "createdAt",
        sortOrder = "desc",
      } = {}) => {
        let url = `orders/admin/all?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Order", id: _id })),
              { type: "Order", id: "ADMIN_LIST" },
            ]
          : [{ type: "Order", id: "ADMIN_LIST" }],
      transformResponse: (response) => ({
        data: response.orders,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalOrders: response.totalOrders,
      }),
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Order", id: arg.orderId },
      ],
    }),

    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Order", id: arg },
        { type: "Book", id: "LIST" },
      ],
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Order", id: arg }],
    }),

    handlePaymentWebhook: builder.mutation({
      query: (webhookData) => ({
        url: "payment/webhook",
        method: "POST",
        body: webhookData,
      }),
    }),

    verifyCheckoutStatus: builder.query({
      query: (paymentId) => `payment/checkout-status/${paymentId}`,
      providesTags: ["Payment"],
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "orders/verify-payment",
        method: "POST",
        body: data,
      }),
    }),
    updateOrderPaymentStatus: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `orders/${orderId}/payment-status`,
        method: "PATCH",
        body: { paymentData },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Order", id: arg.orderId },
        { type: "Payment", id: "STATUS" },
      ],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreateOrderMutation,
  useHandlePaymentWebhookMutation,
  useVerifyCheckoutStatusQuery,
  useUpdateOrderPaymentStatusMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useVerifyPaymentMutation,
} = ordersApiSlice;
