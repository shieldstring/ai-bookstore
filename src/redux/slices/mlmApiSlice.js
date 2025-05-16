import { apiTwo } from "./apiSlice";

export const mlmApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getMLMStats: builder.query({
      query: () => 'mlm/stats',
      providesTags: ['MLM'],
    }),
    getDownline: builder.query({
      query: ({ level = 1, page = 1, limit = 10 }) => 
        `mlm/downline?level=${level}&page=${page}&limit=${limit}`,
      providesTags: ['MLM'],
    }),
    getEarningsHistory: builder.query({
      query: ({ period = 'monthly' }) => `mlm/earnings?period=${period}`,
      providesTags: ['MLM'],
    }),
    getPayoutHistory: builder.query({
      query: ({ page = 1, limit = 10 }) => `mlm/payouts?page=${page}&limit=${limit}`,
      providesTags: ['MLM'],
    }),
    requestPayout: builder.mutation({
      query: (amount) => ({
        url: 'mlm/payouts/request',
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: ['MLM'],
    }),
  }),
});

export const {
  useGetMLMStatsQuery,
  useGetDownlineQuery,
  useGetEarningsHistoryQuery,
  useGetPayoutHistoryQuery,
  useRequestPayoutMutation,
} = mlmApiSlice;