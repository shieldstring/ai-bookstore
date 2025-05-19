import { apiTwo } from "./apiSlice";

export const analyticsApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "analytics/dashboard",
      providesTags: ["Analytics"],
    }),
    getSalesAnalytics: builder.query({
      query: ({ period, year }) =>
        `analytics/sales?period=${period}&year=${year}`,
      providesTags: ["SalesAnalytics"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetSalesAnalyticsQuery } =
  analyticsApiSlice;
