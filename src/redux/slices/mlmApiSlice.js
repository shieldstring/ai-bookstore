import { apiTwo } from "./apiSlice";

export const mlmApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getMLMStats: builder.query({
      query: () => "mlm/admin/mlm/stats",
      providesTags: ["MLM"],
    }),
    getDownline: builder.query({
      query: ({ level = 1, page = 1, limit = 10 }) =>
        `mlm/downline?level=${level}&page=${page}&limit=${limit}`,
      providesTags: ["MLM"],
    }),
    getEarningsHistory: builder.query({
      query: ({ period = "monthly" }) => `mlm/earnings?period=${period}`,
      providesTags: ["MLM"],
    }),
    getPayoutHistory: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `mlm/payouts?page=${page}&limit=${limit}`,
      providesTags: ["MLM"],
    }),
    requestPayout: builder.mutation({
      query: (amount) => ({
        url: "mlm/payouts/request",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["MLM"],
    }),

    /* ────────────────  TIERS  ──────────────── */
    getAllTiers: builder.query({
      query: () => "mlm/admin/mlm/tiers",
      providesTags: ["MLM_TIERS"],
    }),

    addTier: builder.mutation({
      query: (body) => ({
        url: "mlm/admin/mlm/tiers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MLM_TIERS", "MLM_STATS"],
    }),

    updateTier: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `mlm/admin/mlm/tiers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MLM_TIERS", "MLM_STATS"],
    }),

    deleteTier: builder.mutation({
      query: (id) => ({
        url: `mlm/admin/mlm/tiers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MLM_TIERS", "MLM_STATS"],
    }),

    recalculateUserTier: builder.mutation({
      query: (userId) => ({
        url: `mlm/admin/mlm/recalculate/${userId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetMLMStatsQuery,
  useGetDownlineQuery,
  useGetEarningsHistoryQuery,
  useGetPayoutHistoryQuery,
  useRequestPayoutMutation,
  useAddTierMutation,
  useDeleteTierMutation,
  useGetAllTiersQuery,
  useRecalculateUserTierMutation,
  useUpdateTierMutation,
} = mlmApiSlice;
