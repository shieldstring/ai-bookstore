import { ShoppingCart } from 'lucide-react';
import React from 'react'

function BestSellers() {
    const featuredBooks = [
        { id: 1, title: 'Be Your Self & Never Surrender', author: 'Robert Connor', rating: 4.7, price: 21.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: 'BEST SELLER', color: 'bg-blue-900' },
        { id: 2, title: 'What colors of the sky', author: 'Anna Carter', rating: 4.9, price: 19.99, image: '/api/placeholder/170/250', category: 'Arts & Photography', tag: 'BEST SELLER', color: 'bg-blue-600' },
        { id: 3, title: 'Electronic Basic', author: 'David Turner', rating: 4.8, price: 15.0, image: '/api/placeholder/170/250', category: 'Science', tag: '', color: 'bg-red-900' },
        { id: 4, title: 'Theory is Alien Real', author: 'Michael Stevens', rating: 4.6, price: 18.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: '', color: 'bg-purple-600' },
        { id: 5, title: 'Life of Wilds', author: 'Sarah Johnson', rating: 4.5, price: 17.4, image: '/api/placeholder/170/250', category: 'Animals', tag: '', color: 'bg-green-700' },
        { id: 6, title: 'Emily and the Backbone', author: 'Emma Roberts', rating: 4.9, price: 19.5, image: '/api/placeholder/170/250', category: 'Biography', tag: '', color: 'bg-green-500' },
      ];
  return (
    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Best Sellers</h2>
            <button 
              className="text-sm text-purple-700"
            //   onClick={() => onViewChange('catalog')}
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredBooks.map((book) => (
              <div key={book.id} className="relative">
                <div className="relative">
                  {book.tag && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium py-1 px-2 rounded z-10">
                      {book.tag}
                    </div>
                  )}
                  <div 
                    className="bg-gray-100 rounded-lg overflow-hidden" 
                    // onClick={() => onViewChange('detail')}
                  >
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="w-full h-auto object-cover aspect-[2/3]"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <span className="mr-2">⭐ {book.rating}</span>
                    <span>133 reviews</span>
                  </div>
                  <p className="text-xs text-purple-600 mb-1">{book.category}</p>
                  <h3 
                    className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer hover:text-purple-700"
                    // onClick={() => onViewChange('detail')}
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">${book.price.toFixed(1)}</span>
                    <button className="bg-purple-100 rounded-full p-1">
                      <ShoppingCart className="h-4 w-4 text-purple-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default BestSellers