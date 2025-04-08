import React, { useState } from "react";
import {
  Star,
  ChevronRight,
  Heart,
  Grid,
  List,
  ChevronLeft,
  ChevronDown,
  Filter,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";

const BooksPage = () => {
  const [viewType, setViewType] = useState("grid"); // grid, list
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

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

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Favorite toggle
  const toggleFavorite = (id) => {
    // Implementation would go here
    console.log("Toggled favorite for book: ", id);
  };

  // Add to cart handler
  const addToCart = (book) => {
    // Implementation would go here
    console.log("Added to cart: ", book.title);
  };

  // Format price
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Format discount price
  const getDiscountPrice = (price) => {
    // Apply 10% discount
    return price * 0.9;
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters - Only visible in certain views */}
          {(viewType === "grid" || viewType === "list") && showFilters && (
            <div className="w-full md:w-64 md:mr-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Filter</h2>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Categories</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(category.id)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm text-gray-700"
                          >
                            {category.name}
                          </label>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({category.count})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Format Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Book Format</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </h3>
                  <ul className="space-y-2">
                    {formats.map((format) => (
                      <li key={format.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`format-${format.id}`}
                          name="format"
                          className="mr-2 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFormat === format.id}
                          onChange={() => setSelectedFormat(format.id)}
                        />
                        <label
                          htmlFor={`format-${format.id}`}
                          className="text-sm text-gray-700"
                        >
                          {format.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Publisher Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Publisher</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </h3>
                </div>

                {/* Years Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Years</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </h3>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center justify-between">
                    <span>Price Range</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </h3>
                  <div className="px-2">
                    <div className="bg-purple-600 h-1 rounded-full relative my-6">
                      <div className="absolute -top-2 -ml-2 left-1/4">
                        <div className="h-5 w-5 bg-white border border-purple-600 rounded-full" />
                      </div>
                      <div className="absolute -top-2 -ml-2 left-3/4">
                        <div className="h-5 w-5 bg-white border border-purple-600 rounded-full" />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$0</span>
                      <span>$100</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
                  Apply Filters
                </button>

                <button className="w-full text-gray-700 py-2 mt-2 text-sm hover:text-purple-700 transition">
                  Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Books</h1>
              <div className="flex items-center space-x-2">
                {/* Advanced Search Button */}
                <button className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1.5">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Search
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select className="bg-white border border-gray-300 text-sm rounded-md py-1.5 px-3 appearance-none pr-8">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Rating</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className={`p-1.5 ${
                      viewType === "grid"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setViewType("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 ${
                      viewType === "list"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setViewType("list")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Grid View */}
            {viewType === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div key={book.id} className="group relative">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[2/3]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.tag && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          {book.tag}
                        </div>
                      )}

                      <div className="absolute bottom-0 right-0 p-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className="bg-white rounded-full p-2 shadow-md"
                        >
                          <Heart className="w-5 h-5 text-gray-600 hover:text-purple-600" />
                        </button>
                        <button
                          onClick={() => addToCart(book)}
                          className="bg-white rounded-full p-2 shadow-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600 hover:text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span>{book.category}</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-1">
                        {book.author}
                      </p>
                      <div className="flex items-center mb-2">
                        {renderRating(book.rating)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({book.rating})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {formatPrice(book.price)}
                        </span>
                        <span className="text-gray-500 text-sm line-through ml-2">
                          {formatPrice(book.price * 1.2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Book List View */}
            {viewType === "list" && (
              <div className="space-y-6">
                {books.map((book) => (
                  <div key={book.id} className="flex border-b pb-6">
                    <div className="relative h-40 w-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                      {book.tag && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          {book.tag}
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded mr-2">
                              {book.category}
                            </span>
                            {book.tag && (
                              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                {book.tag}
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-lg text-gray-900 mb-1">
                            {book.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2">
                            {book.author}
                          </p>
                          <div className="flex items-center mb-3">
                            {renderRating(book.rating)}
                            <span className="text-xs text-gray-500 ml-1">
                              ({book.rating})
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-xs text-gray-500">
                              542 reviews
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <button
                            className="text-gray-400 hover:text-purple-600 mb-2"
                            onClick={() => toggleFavorite(book.id)}
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-900 text-lg">
                              {formatPrice(book.price)}
                            </span>
                            <span className="text-gray-500 text-sm line-through ml-2">
                              {formatPrice(book.price * 1.2)}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 mb-4">
                            10% OFF
                          </div>
                          <button
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
                            onClick={() => addToCart(book)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-10">
              <button
                className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 mr-2 hover:border-purple-600 hover:text-purple-600"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`flex items-center justify-center h-8 w-8 rounded-full mx-1 ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 hover:border-purple-600 hover:text-purple-600"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 ml-2 hover:border-purple-600 hover:text-purple-600"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <ValueProps />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default BooksPage;
