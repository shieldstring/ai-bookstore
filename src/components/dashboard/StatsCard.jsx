import React from "react";

const StatsCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
    <div className="flex-shrink-0 w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center transition-all duration-350 group-hover:bg-purple-600 group-hover:text-white">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
        {title}
      </p>
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
        {value}
      </h3>
      {change && (
        <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
          {change}
        </p>
      )}
    </div>
  </div>
);

export default StatsCard;