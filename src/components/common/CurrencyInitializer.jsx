import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetCurrencyRatesQuery } from "../../redux/slices/currencyApiSlice";
import { setRates } from "../../redux/slices/currencySlice";

const CurrencyInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { data } = useGetCurrencyRatesQuery();

  useEffect(() => {
    if (data?.rates) {
      dispatch(setRates(data.rates));
    }
  }, [data, dispatch]);

  return children;
};

export default CurrencyInitializer;
