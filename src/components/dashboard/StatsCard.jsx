const StatsCard = ({ icon, title, value, change }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-2 sm:p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
            {icon}
          </div>
          <div className="ml-4">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-xl font-semibold text-gray-900 mt-1">
              {value}
            </dd>
            <p className="text-xs text-gray-500 mt-1">
              {change}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default StatsCard;