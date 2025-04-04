import React, { useState } from 'react'

function BooksPage() {
    const [viewType, setViewType] = useState('grid'); // grid, list
  
  // Sample data for books
  const books = [
    { id: 1, title: 'Be Your Self & Never Surrender', author: 'Robert Connor', rating: 4.7, price: 21.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: 'BEST SELLER' },
    { id: 2, title: 'What colors of the sky', author: 'Anna Carter', rating: 4.9, price: 19.99, image: '/api/placeholder/170/250', category: 'Arts & Photography', tag: 'BEST SELLER' },
    { id: 3, title: 'Such a Fun Age', author: 'Kiley Reid', rating: 4.5, price: 18.9, image: '/api/placeholder/170/250', category: 'Fiction', tag: 'BEST SELLER' },
    { id: 4, title: 'Electronic Basic', author: 'David Turner', rating: 4.8, price: 15.0, image: '/api/placeholder/170/250', category: 'Science', tag: '' },
    { id: 5, title: 'So you want to talk about race', author: 'Ijeoma Oluo', rating: 4.8, price: 22.3, image: '/api/placeholder/170/250', category: 'Biography', tag: 'BEST SELLER' },
    { id: 6, title: 'Life of Wilds', author: 'Sarah Johnson', rating: 4.5, price: 17.4, image: '/api/placeholder/170/250', category: 'Animals', tag: '' },
    { id: 7, title: 'Theory is Alien Real', author: 'Michael Stevens', rating: 4.6, price: 18.5, image: '/api/placeholder/170/250', category: 'Fiction', tag: '' },
    { id: 8, title: 'Emily and the Backbone', author: 'Emma Roberts', rating: 4.9, price: 19.5, image: '/api/placeholder/170/250', category: 'Biography', tag: '' },
    { id: 9, title: 'Story of Everest', author: 'John Krakauer', rating: 4.7, price: 21.4, image: '/api/placeholder/170/250', category: 'Adventure', tag: '' },
    { id: 10, title: 'SAKURA', author: 'Naomi Watanabe', rating: 4.6, price: 19.9, image: '/api/placeholder/170/250', category: 'Fiction', tag: '' },
    { id: 11, title: 'Luster, a Novel', author: 'Raven Leilani', rating: 4.4, price: 22.5, image: '/api/placeholder/170/250', category: 'Literature', tag: '' },
    { id: 12, title: 'Real Life', author: 'Brandon Taylor', rating: 4.5, price: 21.0, image: '/api/placeholder/170/250', category: 'Fiction', tag: '' },
  ];
  
  // Categories list for filter
  const categories = [
    { id: 'all', name: 'All Books', count: 68 },
    { id: 'arts', name: 'Arts & Photography', count: 12 },
    { id: 'biographies', name: 'Biographies & Memoirs', count: 15 },
    { id: 'business', name: 'Business & Money', count: 8 },
    { id: 'children', name: 'Children\'s Books', count: 14 },
    { id: 'comics', name: 'Comics & Graphic Novels', count: 6 },
    { id: 'computer', name: 'Computer & Technology', count: 10 },
    { id: 'cooking', name: 'Cooking, Food & Wine', count: 7 },
    { id: 'education', name: 'Education & Teaching', count: 9 },
    { id: 'health', name: 'Health & Fitness', count: 8 },
    { id: 'love', name: 'Love & Romance', count: 12 },
    { id: 'travel', name: 'Travel & Tourism', count: 11 },
  ];
  
  // Formats for filter
  const formats = [
    { id: 'all', name: 'All Formats' },
    { id: 'hardcover', name: 'Hardcover' },
    { id: 'paperback', name: 'Paperback' },
    { id: 'audio', name: 'Audio Book' },
    { id: 'large', name: 'Large Print' },
    { id: 'ebook', name: 'eBook' },
  ];
  return (
    <div>{/* Breadcrumb */}
    <div className="bg-gray-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm">
          <a href="#" className="text-gray-600 hover:text-purple-700">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Books</span>
        </div>
      </div>
    </div></div>
  )
}

export default BooksPage