import { apiTwo } from "./apiSlice";

export const sellerApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    // Public Routes
    getSellerStorefront: builder.query({
      query: (id) => `seller/store/${id}`,
      providesTags: (result, error, id) => [{ type: 'SellerStorefront', id }],
    }),

    // Seller Protected Routes
    registerSeller: builder.mutation({
      query: (sellerData) => ({
        url: 'seller/register',
        method: 'POST',
        body: sellerData,
      }),
      invalidatesTags: [{ type: 'Seller', id: 'LIST' }],
    }),

    editSellerProfile: builder.mutation({
      query: (profileData) => ({
        url: 'seller/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: [{ type: 'Seller', id: 'PROFILE' }],
    }),

    deleteSellerProfile: builder.mutation({
      query: () => ({
        url: 'seller/profile',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Seller', id: 'PROFILE' }],
    }),

    getSellerDashboard: builder.query({
      query: () => 'seller/dashboard',
      providesTags: ['SellerDashboard'],
    }),

    requestReapproval: builder.mutation({
      query: () => ({
        url: 'seller/request-reapproval',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Seller', id: 'STATUS' }],
    }),

    // Admin Routes
    getPendingSellers: builder.query({
      query: () => 'seller/admin/pending',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Seller', id: _id })),
              { type: 'Seller', id: 'PENDING' },
            ]
          : [{ type: 'Seller', id: 'PENDING' }],
    }),

    getApprovedSellers: builder.query({
      query: () => 'seller/admin/approved',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Seller', id: _id })),
              { type: 'Seller', id: 'APPROVED' },
            ]
          : [{ type: 'Seller', id: 'APPROVED' }],
    }),

    approveSeller: builder.mutation({
      query: (id) => ({
        url: `seller/admin/approve/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Seller', id },
        { type: 'Seller', id: 'PENDING' },
        { type: 'Seller', id: 'APPROVED' },
      ],
    }),

    rejectSeller: builder.mutation({
      query: (id) => ({
        url: `seller/admin/reject/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Seller', id },
        { type: 'Seller', id: 'PENDING' },
      ],
    }),

    deleteSellerByAdmin: builder.mutation({
      query: (id) => ({
        url: `seller/admin/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Seller', id },
        { type: 'Seller', id: 'APPROVED' },
      ],
    }),

    getAdminSellerMetrics: builder.query({
      query: () => 'seller/admin/',
      providesTags: ['SellerMetrics'],
    }),
  }),
});

// Export hooks for your components to use
export const {
  // Public
  useGetSellerStorefrontQuery,
  
  // Seller Protected
  useRegisterSellerMutation,
  useEditSellerProfileMutation,
  useDeleteSellerProfileMutation,
  useGetSellerDashboardQuery,
  useRequestReapprovalMutation,
  
  // Admin
  useGetPendingSellersQuery,
  useGetApprovedSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useDeleteSellerByAdminMutation,
  useGetAdminSellerMetricsQuery,
} = sellerApiSlice;