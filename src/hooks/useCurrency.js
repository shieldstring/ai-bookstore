import { useSelector } from "react-redux";
import {
  convertFromBase,
  formatPrice,
  formatPricePlain,
  getCurrencyMeta,
} from "../utils/currency";

export const useCurrency = () => {
  const { currency, rates } = useSelector((state) => state.currency);

  const convert = (amountGBP) => convertFromBase(amountGBP, currency, rates);

  const format = (amountGBP, options = {}) =>
    formatPrice(amountGBP, { currency, rates, ...options });

  const formatPlain = (amountGBP, options = {}) =>
    formatPricePlain(amountGBP, { currency, rates, ...options });

  return {
    currency,
    rates,
    meta: getCurrencyMeta(currency),
    convert,
    format,
    formatPlain,
  };
};

export default useCurrency;
