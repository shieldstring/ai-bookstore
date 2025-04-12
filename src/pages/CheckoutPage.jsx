import { useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import Newsletter from "../components/common/Newsletter";

export default function CheckoutPage() {
  const [quantities, setQuantities] = useState({
    book1: 1,
    book2: 4,
  });

  const [promoCode, setPromoCode] = useState("");

  const books = [
    {
      id: "book1",
      isbn: "0123456789",
      title: "Emily and the Backbone",
      author: "Claire Holmes",
      price: 21.4,
      coverColor: "emerald-500",
    },
    {
      id: "book2",
      isbn: "9876543210",
      title: "So You Want To Talk About Race",
      author: "Ijeoma Oluo",
      price: 15.63,
      image: "/api/placeholder/100/150",
    },
  ];

  const updateQuantity = (id, newQty) => {
    if (newQty >= 1) {
      setQuantities({ ...quantities, [id]: newQty });
    }
  };

  const removeItem = (id) => {
    const newQuantities = { ...quantities };
    delete newQuantities[id];
    setQuantities(newQuantities);
  };

  const calculateSubtotal = () => {
    return books.reduce((total, book) => {
      return total + book.price * (quantities[book.id] || 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 ">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center text-sm">
            <a href="#" className="hover:text-gray-600 font-semibold text-purple-700">
              Home
            </a>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">Cart</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 lg:py-10">
        <div className="mb-8">
          <div className="bg-purple-800 text-white rounded-t-lg p-3 grid grid-cols-12 gap-4">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Total Price</div>
          </div>

          {books.map((book) => (
            <div
              key={book.id}
              className="border-b py-4 grid grid-cols-12 gap-4 items-center"
            >
              <div className="col-span-1">
                {book.coverColor ? (
                  <div
                    className={`bg-${book.coverColor} w-16 h-20 rounded flex items-center justify-center text-white text-xs p-2 text-center`}
                  >
                    Emily and the Backbone
                  </div>
                ) : (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
              </div>

              <div className="col-span-5">
                <div className="text-xs text-gray-500">ISBN {book.isbn}</div>
                <div className="font-medium">{book.title}</div>
                <div className="text-sm text-gray-500">{book.author}</div>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <button
                  className="px-2 py-1 bg-gray-200 rounded-l"
                  onClick={() =>
                    updateQuantity(book.id, quantities[book.id] - 1)
                  }
                >
                  -
                </button>
                <span className="px-3 py-1 bg-gray-100">
                  {quantities[book.id]}
                </span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded-r"
                  onClick={() =>
                    updateQuantity(book.id, quantities[book.id] + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="col-span-2 text-center">
                ${book.price.toFixed(2)}
              </div>

              <div className="col-span-1 text-center">
                ${(book.price * quantities[book.id]).toFixed(2)}
              </div>

              <div className="col-span-1 text-center">
                <button
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => removeItem(book.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-pink-100 rounded-lg p-6 grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Shopping Summary</h2>
            <p className="text-gray-600 text-sm mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              aliquet turpis molestie ut ultrices at sapien et dictum.
            </p>

            <div className="mb-4">
              <p className="mb-2">Have a coupon code?</p>
              <div className="flex">
                <div className="bg-pink-200 p-2 rounded-l flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-800 px-1">
                    %
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter promo code here"
                  className="p-2 border border-pink-200 flex-grow"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 rounded-r">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-300 my-4"></div>
            <div className="flex justify-between mb-6">
              <span>Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded font-medium">
              CHECKOUT
            </button>
            <button className="text-center w-full py-3 text-gray-600 hover:text-purple-700">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
