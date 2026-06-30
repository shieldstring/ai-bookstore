export const DEFAULT_CURRENCY = "GBP";
export const CURRENCY_SYMBOL = "£";
export const MAX_PRODUCT_PRICE = 999.99;

export const formatPrice = (price, options = {}) => {
  const { currency = DEFAULT_CURRENCY, locale = "en-GB" } = options;
  const amount = normalizePrice(price);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPricePlain = (price) => {
  const amount = normalizePrice(price);
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
};

export const normalizePrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num) || num < 0) return 0;
  return num;
};

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
