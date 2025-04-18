import { apiTwo } from "./apiSlice";

export const ordersApiSlice = apiTwo.injectEndpoints({
    endpoints: (builder) => ({
      createPaymentIntent: builder.mutation({
        query: (amount) => ({
          url: '/payment/create-payment-intent',
          method: 'POST',
          body: { amount },
        }),
      }),
      createOrder: builder.mutation({
        query: (order) => ({
          url: '/orders',
          method: 'POST',
          body: order,
        }),
      }),
      handlePaymentWebhook: builder.mutation({
        query: (webhookData) => ({
          url: '/payment/webhook',
          method: 'POST',
          body: webhookData,
        }),
      }),
      verifyPaymentStatus: builder.query({
        query: (paymentId) => ({
          url: `/payment/status/${paymentId}`,
          method: 'GET',
        }),
        providesTags: ['Payment'],
      }),
      updateOrderPaymentStatus: builder.mutation({
        query: ({ orderId, paymentData }) => ({
          url: `/orders/${orderId}/payment-status`,
          method: 'PATCH',
          body: { paymentData },
        }),
        invalidatesTags: ['Order'],
      }),
    }),
  });
  
  export const { 
    useCreatePaymentIntentMutation, 
    useCreateOrderMutation,
    useHandlePaymentWebhookMutation,
    useVerifyPaymentStatusQuery,
    useUpdateOrderPaymentStatusMutation
  } = ordersApiSlice;