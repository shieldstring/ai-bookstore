import { Heart, ShoppingCart, X } from "lucide-react";
import SEO from "../../../components/SEO";
import { useEffect } from "react";

const Wishlist = () => {
   useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);
  const items = [
    {
      id: 1,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      price: 12.99,
      inStock: true,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 14.99,
      inStock: false,
    },
    {
      id: 3,
      title: "Deep Work",
      author: "Cal Newport",
      price: 11.99,
      inStock: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <SEO
        title="WishList"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start border-b border-gray-100 pb-4"
          >
            <img
              src={`/book-covers/${item.id}.jpg`}
              alt={item.title}
              className="w-16 h-24 object-cover rounded-lg mr-4"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.author}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex items-center mt-2">
                {item.inStock ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-purple-600 hover:text-purple-800">
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
