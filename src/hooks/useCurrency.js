import { useSelector } from "react-redux";
import {
  BASE_CURRENCY,
  convertFromBase,
  formatBasePricePlain,
  formatPrice,
  formatPricePlain,
  formatStoredPricePlain,
  getCurrencyMeta,
} from "../utils/currency";

export const useCurrency = () => {
  const { currency, rates } = useSelector((state) => state.currency);

  const convert = (amountGBP) => convertFromBase(amountGBP, currency, rates);

  const format = (amountGBP, options = {}) =>
    formatPrice(amountGBP, { currency, rates, ...options });

  const formatPlain = (amountGBP, options = {}) =>
    formatPricePlain(amountGBP, { currency, rates, ...options });

  const formatBase = (amountGBP, options = {}) =>
    formatBasePricePlain(amountGBP, options);

  const formatOrder = (amount, orderCurrency = BASE_CURRENCY, options = {}) =>
    formatStoredPricePlain(amount, orderCurrency || BASE_CURRENCY, options);

  return {
    currency,
    rates,
    meta: getCurrencyMeta(currency),
    convert,
    format,
    formatPlain,
    formatBase,
    formatOrder,
  };
};

export default useCurrency;
