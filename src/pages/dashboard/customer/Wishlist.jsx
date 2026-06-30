import { ShoppingCart, X, Heart, AlertCircle } from "lucide-react";
import SEO from "../../../components/SEO";
import { useEffect } from "react";
import useCurrency from "../../../hooks/useCurrency";

const Wishlist = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  
  const { formatPlain } = useCurrency();

  const items = [
    {
      id: 1,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      price: 12.99,
      inStock: true,
      image: "https://i.pinimg.com/736x/e6/a2/c6/e6a2c6b650e79f1095f381f54a8bab69.jpg",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 14.99,
      inStock: false,
      image: "https://jamesclear.com/wp-content/uploads/2021/08/atomic-habits-dots-1.png",
    },
    {
      id: 3,
      title: "Deep Work",
      author: "Cal Newport",
      price: 11.99,
      inStock: true,
      image: "https://m.media-amazon.com/images/I/41D8V27z6RL._SL500_.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 min-h-[70vh]">
      <SEO
        title="WishList"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100">
        <Heart className="h-5 w-5 text-purple-600 fill-purple-100" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-extrabold">My Wishlist</h2>
          <p className="text-slate-500 text-xs mt-0.5">Keep track of your favorite books and future reads</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 hover:shadow-xs transition-all duration-200 group"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-20 object-cover rounded-lg mr-4 border border-slate-100 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-slate-800 text-sm truncate">{item.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">By {item.author}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-slate-855 font-extrabold text-sm">
                  {formatPlain(item.price, { priceIsConverted: false })}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 bg-purple-50 text-purple-650 hover:bg-purple-650 hover:text-white rounded-xl transition-all duration-200 cursor-pointer">
                <ShoppingCart className="h-4.5 w-4.5" />
              </button>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
