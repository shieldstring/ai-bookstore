// import { ShoppingCart } from 'lucide-react';
// import React from 'react'

// function TopRated() {
//     const featuredBooks = [
//         { id: 1, title: 'Be Your Self & Never Surrender', author: 'Robert Connor', rating: 4.7, price: 21.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: 'BEST SELLER', color: 'bg-blue-900' },
//         { id: 2, title: 'What colors of the sky', author: 'Anna Carter', rating: 4.9, price: 19.99, image: '/api/placeholder/170/250', category: 'Arts & Photography', tag: 'BEST SELLER', color: 'bg-blue-600' },
//         { id: 3, title: 'Electronic Basic', author: 'David Turner', rating: 4.8, price: 15.0, image: '/api/placeholder/170/250', category: 'Science', tag: '', color: 'bg-red-900' },
//         { id: 4, title: 'Theory is Alien Real', author: 'Michael Stevens', rating: 4.6, price: 18.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: '', color: 'bg-purple-600' },
//         { id: 5, title: 'Life of Wilds', author: 'Sarah Johnson', rating: 4.5, price: 17.4, image: '/api/placeholder/170/250', category: 'Animals', tag: '', color: 'bg-green-700' },
//         { id: 6, title: 'Emily and the Backbone', author: 'Emma Roberts', rating: 4.9, price: 19.5, image: '/api/placeholder/170/250', category: 'Biography', tag: '', color: 'bg-green-500' },
//       ];
//   return (
//     <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Best Sellers</h2>
//             <button
//               className="text-sm text-purple-700"
//             //   onClick={() => onViewChange('catalog')}
//             >
//               View All →
//             </button>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {featuredBooks.map((book) => (
//               <div key={book.id} className="relative">
//                 <div className="relative">
//                   {book.tag && (
//                     <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium py-1 px-2 rounded z-10">
//                       {book.tag}
//                     </div>
//                   )}
//                   <div
//                     className="bg-gray-100 rounded-lg overflow-hidden"
//                     // onClick={() => onViewChange('detail')}
//                   >
//                     <img
//                       src={book.image}
//                       alt={book.title}
//                       className="w-full h-auto object-cover aspect-[2/3]"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <div className="flex items-center text-xs text-gray-600 mb-1">
//                     <span className="mr-2">⭐ {book.rating}</span>
//                     <span>133 reviews</span>
//                   </div>
//                   <p className="text-xs text-purple-600 mb-1">{book.category}</p>
//                   <h3
//                     className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer hover:text-purple-700"
//                     // onClick={() => onViewChange('detail')}
//                   >
//                     {book.title}
//                   </h3>
//                   <p className="text-xs text-gray-600 mb-2">{book.author}</p>
//                   <div className="flex justify-between items-center">
//                     <span className="font-bold text-sm">${book.price.toFixed(1)}</span>
//                     <button className="bg-purple-100 rounded-full p-1">
//                       <ShoppingCart className="h-4 w-4 text-purple-700" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//   )
// }

// export default TopRated

import React, { useRef } from "react";

const TopRatedBooks = () => {
  const books = [
    {
      id: 1,
      title: "Sunglasses",
      author: "Converse Lee",
      price: 18.13,
      rating: 4,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=Sunglasses&font=Montserrat",
    },
    {
      id: 2,
      title: "Electronic Basic",
      author: "John Doe",
      price: 19.23,
      rating: 5,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=Electronic+Basic&font=Montserrat",
    },
    {
      id: 3,
      title: "What Colors of the Sky",
      author: "Sandra Axe",
      price: 13.77,
      rating: 4,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=What+Colors+of+the+Sky&font=Montserrat",
    },
    {
      id: 4,
      title: "Theory: Is Alien Real",
      author: "Alan Burner",
      price: 15.63,
      rating: 3,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=Theory:+Is+Alien+Real&font=Montserrat",
    },
    {
      id: 5,
      title: "Sakura",
      author: "Dao Max",
      price: 19.99,
      rating: 5,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=Sakura&font=Montserrat",
    },
    {
      id: 6,
      title: "Be Yourself & Never Surrender",
      author: "Jess Steve",
      price: 15.63,
      rating: 4,
      image:
        "https://placehold.co/150x200/EEE/31343C?text=Be+Yourself+%26+Never+Surrender&font=Montserrat",
    },
    {
      id: 7,
      title: "Be Your Self & Never Surrender",
      author: "Robert Connor",
      rating: 4,
      price: 21.5,
      image:  "https://placehold.co/150x200/EEE/31343C?text=Be+Yourself+%26+Never+Surrender&font=Montserrat",
      
    },
    {
      id: 8,
      title: "What colors of the sky",
      author: "Anna Carter",
      rating: 4,
      price: 19.99,
      image: "https://placehold.co/150x200/EEE/31343C?text=What+Colors+of+the+Sky&font=Montserrat",
      
    },
    {
      id: 9,
      title: "Electronic Basic",
      author: "David Turner",
      rating: 5,
      price: 15.0,
      image: "/api/placeholder/170/250",
      
    },
    {
      id: 10,
      title: "Theory is Alien Real",
      author: "Michael Stevens",
      rating: 5,
      price: 18.5,
      image: "/api/placeholder/170/250",
    },
  ];

  const StarRating = ({ rating }) => {
    const maxRating = 5;
    const fullStars = Math.min(rating, maxRating);
    const emptyStars = maxRating - fullStars;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-4 h-4 text-yellow-500 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="bg-[#FDF8FE] py-8 lg:py-16 lg:px-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            10 Top Rated Books
          </h2>
          <a href="#" className="text-sm text-indigo-600 hover:underline">
            View more -&gt;
          </a>
        </div>
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow-md focus:outline-none"
            onClick={scrollLeft}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div
            className="flex space-x-6 overflow-x-auto scroll-smooth py-4"
            ref={containerRef}
          >
            {books.map((book, index) => (
              <div key={index} className="flex-shrink-0 w-32 md:w-40">
                <div className="rounded-md shadow-md overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "3 / 4" }}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-gray-700 truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {book.author}
                  </p>
                  <StarRating rating={book.rating} />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${book.price.toFixed(2)}
                    </span>
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow-md focus:outline-none"
            onClick={scrollRight}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopRatedBooks;
