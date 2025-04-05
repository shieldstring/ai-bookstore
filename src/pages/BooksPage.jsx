import React, { useState } from "react";

function BooksPage() {
  const [viewType, setViewType] = useState("grid"); // grid, list
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Sample data for books
  const books = [
    {
      id: 1,
      title: "Be Your Self & Never Surrender",
      author: "Robert Connor",
      rating: 4.7,
      price: 21.5,
      image: "/api/placeholder/170/250",
      category: "Fiction",
      tag: "BEST SELLER",
    },
    {
      id: 2,
      title: "What colors of the sky",
      author: "Anna Carter",
      rating: 4.9,
      price: 19.99,
      image: "/api/placeholder/170/250",
      category: "Arts & Photography",
      tag: "BEST SELLER",
    },
    {
      id: 3,
      title: "Such a Fun Age",
      author: "Kiley Reid",
      rating: 4.5,
      price: 18.9,
      image: "/api/placeholder/170/250",
      category: "Fiction",
      tag: "BEST SELLER",
    },
    {
      id: 4,
      title: "Electronic Basic",
      author: "David Turner",
      rating: 4.8,
      price: 15.0,
      image: "/api/placeholder/170/250",
      category: "Science",
      tag: "",
    },
    {
      id: 5,
      title: "So you want to talk about race",
      author: "Ijeoma Oluo",
      rating: 4.8,
      price: 22.3,
      image: "/api/placeholder/170/250",
      category: "Biography",
      tag: "BEST SELLER",
    },
    {
      id: 6,
      title: "Life of Wilds",
      author: "Sarah Johnson",
      rating: 4.5,
      price: 17.4,
      image: "/api/placeholder/170/250",
      category: "Animals",
      tag: "",
    },
    {
      id: 7,
      title: "Theory is Alien Real",
      author: "Michael Stevens",
      rating: 4.6,
      price: 18.5,
      image: "/api/placeholder/170/250",
      category: "Fiction",
      tag: "",
    },
    {
      id: 8,
      title: "Emily and the Backbone",
      author: "Emma Roberts",
      rating: 4.9,
      price: 19.5,
      image: "/api/placeholder/170/250",
      category: "Biography",
      tag: "",
    },
    {
      id: 9,
      title: "Story of Everest",
      author: "John Krakauer",
      rating: 4.7,
      price: 21.4,
      image: "/api/placeholder/170/250",
      category: "Adventure",
      tag: "",
    },
    {
      id: 10,
      title: "SAKURA",
      author: "Naomi Watanabe",
      rating: 4.6,
      price: 19.9,
      image: "/api/placeholder/170/250",
      category: "Fiction",
      tag: "",
    },
    {
      id: 11,
      title: "Luster, a Novel",
      author: "Raven Leilani",
      rating: 4.4,
      price: 22.5,
      image: "/api/placeholder/170/250",
      category: "Literature",
      tag: "",
    },
    {
      id: 12,
      title: "Real Life",
      author: "Brandon Taylor",
      rating: 4.5,
      price: 21.0,
      image: "/api/placeholder/170/250",
      category: "Fiction",
      tag: "",
    },
  ];

  // Categories list for filter
  const categories = [
    { id: "all", name: "All Books", count: 68 },
    { id: "arts", name: "Arts & Photography", count: 12 },
    { id: "biographies", name: "Biographies & Memoirs", count: 15 },
    { id: "business", name: "Business & Money", count: 8 },
    { id: "children", name: "Children's Books", count: 14 },
    { id: "comics", name: "Comics & Graphic Novels", count: 6 },
    { id: "computer", name: "Computer & Technology", count: 10 },
    { id: "cooking", name: "Cooking, Food & Wine", count: 7 },
    { id: "education", name: "Education & Teaching", count: 9 },
    { id: "health", name: "Health & Fitness", count: 8 },
    { id: "love", name: "Love & Romance", count: 12 },
    { id: "travel", name: "Travel & Tourism", count: 11 },
  ];

  // Formats for filter
  const formats = [
    { id: "all", name: "All Formats" },
    { id: "hardcover", name: "Hardcover" },
    { id: "paperback", name: "Paperback" },
    { id: "audio", name: "Audio Book" },
    { id: "large", name: "Large Print" },
    { id: "ebook", name: "eBook" },
  ];

  // Publisher options
  const publishers = [
    { name: 'All', count: 154 },
    { name: 'Indie', count: 32 },
    { name: 'Self publish', count: 12 },
    { name: 'Corporate', count: 110 }
  ];

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
  };
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <a href="#" className="text-gray-600 hover:text-purple-700">
              Home
            </a>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">Books</span>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white border-r">
        <h2 className="text-lg font-bold mb-4">Filter</h2>
        
        {/* Categories */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Categories</h3>
            <span className="text-gray-500 text-sm">▼</span>
          </div>
          <ul className="space-y-2 text-sm">
            {categories.map((category, index) => (
              <li key={index} className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>{category.name}</span>
                </label>
                <span className="text-gray-500">({category.count})</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Book Format */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Book Format</h3>
            <span className="text-gray-500 text-sm">▼</span>
          </div>
          <ul className="space-y-2 text-sm">
            {formats.map((format, index) => (
              <li key={index} className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" checked={index === 0} />
                  <span>{format.name}</span>
                </label>
                <span className="text-gray-500">({format.count})</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Publisher */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Publisher</h3>
            <span className="text-gray-500 text-sm">▼</span>
          </div>
          <ul className="space-y-2 text-sm">
            {publishers.map((publisher, index) => (
              <li key={index} className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="radio" name="publisher" className="mr-2" checked={index === 0} />
                  <span>{publisher.name}</span>
                </label>
                <span className="text-gray-500">({publisher.count})</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Price Range</h3>
            <span className="text-gray-500 text-sm">▼</span>
          </div>
          <div className="px-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={priceRange[1]} 
              onChange={handlePriceChange}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-xs">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <button className="mt-4 w-full py-2 px-4 bg-purple-100 text-purple-600 rounded-md text-sm font-medium">
            Apply Filters
          </button>
          <button className="mt-2 w-full py-2 text-gray-500 text-sm">
            Clear Filter
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Books</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="py-1 px-3 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button className="bg-purple-600 text-white p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="border border-gray-300 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-64 object-cover"
                  style={{ backgroundColor: book.id % 3 === 0 ? '#1E3A8A' : book.id % 3 === 1 ? '#9D174D' : '#065F46' }}
                />
                {book.tag && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {book.tag}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 p-2 flex flex-col items-center space-y-2">
                  <button className="bg-white rounded-full p-2 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="bg-white rounded-full p-2 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-xs">{book.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({book.reviews} reviews)</span>
                </div>
                <h3 className="font-medium text-sm mb-1">{book.title}</h3>
                <div className="flex items-baseline">
                  <span className="font-bold text-sm">${book.price.toFixed(1)}</span>
                  {book.originalPrice && (
                    <span className="ml-2 text-xs text-gray-500 line-through">
                      ${book.originalPrice.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <button className="bg-pink-100 text-pink-600 py-2 px-6 rounded-full text-sm font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default BooksPage;
