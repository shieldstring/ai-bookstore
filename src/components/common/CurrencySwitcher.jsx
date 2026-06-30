import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { setCurrency } from "../../redux/slices/currencySlice";
import { SUPPORTED_CURRENCIES } from "../../utils/currency";

const CurrencySwitcher = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state) => state.currency);

  const handleChange = (e) => {
    dispatch(setCurrency(e.target.value));
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={currency}
        onChange={handleChange}
        aria-label="Select currency"
        className="appearance-none bg-transparent border border-gray-200 rounded-md pl-2 pr-7 py-1.5 text-sm font-medium text-gray-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
      >
        {Object.values(SUPPORTED_CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-1.5 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default CurrencySwitcher;
