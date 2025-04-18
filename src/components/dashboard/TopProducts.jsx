import { Book, TrendingUp } from 'lucide-react';

const TopProducts = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center">
          <span className="w-6 text-sm font-medium text-gray-500">{index + 1}</span>
          <div className="flex-shrink-0 h-10 w-8 mr-3">
            <img 
              src={product.image} 
              alt={product.title} 
              className="h-full w-full object-cover rounded shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">{product.title}</h4>
            <p className="text-xs text-gray-500">{product.author}</p>
          </div>
          <div className="flex items-center ml-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-900">{product.sold}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;