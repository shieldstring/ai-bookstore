export const DEFAULT_CURRENCY = "GBP";
export const BASE_CURRENCY = "GBP";
export const MAX_PRODUCT_PRICE = 999.99;

export const SUPPORTED_CURRENCIES = {
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
  USD: { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  NGN: { code: "NGN", symbol: "₦", locale: "en-NG", name: "Nigerian Naira" },
};

export const DEFAULT_RATES = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  NGN: 1950,
};

export const CURRENCY_STORAGE_KEY = "wisdompeters_currency";

export const normalizePrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num) || num < 0) return 0;
  return num;
};

export const roundPrice = (amount) => Math.round(amount * 100) / 100;

export const convertFromBase = (amountInBase, toCurrency, rates = DEFAULT_RATES) => {
  const target = toCurrency || DEFAULT_CURRENCY;
  if (target === BASE_CURRENCY) return roundPrice(normalizePrice(amountInBase));
  const rate = rates[target] || 1;
  return roundPrice(normalizePrice(amountInBase) * rate);
};

export const getCurrencyMeta = (currency = DEFAULT_CURRENCY) =>
  SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];

export const formatPrice = (price, options = {}) => {
  const {
    currency = DEFAULT_CURRENCY,
    rates = DEFAULT_RATES,
    locale,
    priceIsConverted = false,
  } = options;

  const amount = priceIsConverted
    ? normalizePrice(price)
    : convertFromBase(price, currency, rates);

  const meta = getCurrencyMeta(currency);

  return new Intl.NumberFormat(locale || meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPricePlain = (price, options = {}) => {
  const {
    currency = DEFAULT_CURRENCY,
    rates = DEFAULT_RATES,
    priceIsConverted = false,
  } = options;

  const amount = priceIsConverted
    ? normalizePrice(price)
    : convertFromBase(price, currency, rates);

  const meta = getCurrencyMeta(currency);
  return `${meta.symbol}${amount.toFixed(2)}`;
};

/** Format amounts stored in GBP (catalog prices, admin inputs). */
export const formatBasePrice = (price, options = {}) =>
  formatPrice(price, { currency: BASE_CURRENCY, ...options });

export const formatBasePricePlain = (price, options = {}) =>
  formatPricePlain(price, { currency: BASE_CURRENCY, ...options });

/** Format amounts already stored in a specific currency (e.g. order totals). */
export const formatStoredPrice = (amount, currencyCode = BASE_CURRENCY, options = {}) =>
  formatPrice(amount, {
    currency: currencyCode,
    priceIsConverted: true,
    ...options,
  });

export const formatStoredPricePlain = (
  amount,
  currencyCode = BASE_CURRENCY,
  options = {}
) =>
  formatPricePlain(amount, {
    currency: currencyCode,
    priceIsConverted: true,
    ...options,
  });

export const isValidProductPrice = (price) => {
  const num = parseFloat(price);
  return !Number.isNaN(num) && num > 0 && num <= MAX_PRODUCT_PRICE;
};

export const getPriceValidationError = (price, label = "Price") => {
  if (price === "" || price == null) return `${label} is required`;
  if (Number.isNaN(parseFloat(price))) return `${label} must be a number`;
  if (parseFloat(price) <= 0) return `${label} must be greater than zero`;
  if (parseFloat(price) > MAX_PRODUCT_PRICE) {
    return `${label} must not exceed ${formatPricePlain(MAX_PRODUCT_PRICE)}`;
  }
  return null;
};

export const loadStoredCurrency = () => {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return SUPPORTED_CURRENCIES[stored] ? stored : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
};

export const saveStoredCurrency = (currency) => {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    // ignore storage errors
  }
};
