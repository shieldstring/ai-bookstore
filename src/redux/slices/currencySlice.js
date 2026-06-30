import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_CURRENCY,
  DEFAULT_RATES,
  loadStoredCurrency,
  saveStoredCurrency,
} from "../../utils/currency";

const initialState = {
  currency: loadStoredCurrency(),
  rates: DEFAULT_RATES,
  ratesLoaded: false,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      saveStoredCurrency(action.payload);
    },
    setRates: (state, action) => {
      state.rates = { ...DEFAULT_RATES, ...action.payload };
      state.ratesLoaded = true;
    },
  },
});

export const { setCurrency, setRates } = currencySlice.actions;
export default currencySlice.reducer;
