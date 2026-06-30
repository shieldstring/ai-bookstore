import { apiOne } from "./apiSlice";

export const currencyApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencyRates: builder.query({
      query: () => "currency/rates",
    }),
    getSupportedCurrencies: builder.query({
      query: () => "currency/supported",
    }),
  }),
});

export const { useGetCurrencyRatesQuery, useGetSupportedCurrenciesQuery } =
  currencyApiSlice;
