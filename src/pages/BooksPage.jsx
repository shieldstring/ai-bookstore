import React, { useEffect, useState } from "react";
import {
  Star,
  Heart,
  Grid,
  List,
  ChevronDown,
  Filter,
  ShoppingCart,
} from "lucide-react";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";
import Pagination from "../components/common/Pagination";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetBookListsQuery } from "../redux/slices/bookSlice";
import { toast } from "react-toastify";
import { addToCartWithSync } from "../redux/slices/cartThunks";
import { useDispatch } from "react-redux";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";
import ErrorMessage from "../components/common/ErrorMessage";

const BooksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(searchParams.get("limit")) || 8
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category")?.split(",") || []
  );
  const [selectedFormats, setSelectedFormats] = useState(
    searchParams.get("format")?.split(",") || []
  );
  const [priceRange, setPriceRange] = useState([
    parseFloat(searchParams.get("minPrice")) || 0,
    parseFloat(searchParams.get("maxPrice")) || 100,
  ]);
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "newest"
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", itemsPerPage.toString());
    if (selectedCategories.length)
      params.set("category", selectedCategories.join(","));
    if (selectedFormats.length) params.set("format", selectedFormats.join(","));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 100) params.set("maxPrice", priceRange[1].toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortOption !== "newest") params.set("sort", sortOption);

    navigate(`?${params.toString()}`, { replace: true });
  }, [
    currentPage,
    itemsPerPage,
    selectedCategories,
    selectedFormats,
    priceRange,
    searchQuery,
    sortOption,
    navigate,
  ]);

  // Get books with current filters
  const { data, isLoading, isError } = useGetBookListsQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategories.join(","),
    format: selectedFormats.join(","),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    search: searchQuery,
    sort: sortOption,
  });

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchParams.get("search") !== searchQuery) {
      setSearchQuery(searchParams.get("search") || "");
      setCurrentPage(1);
    }
  }, [location.search]);

  const books = data?.data || [];
  const totalBooks = data?.total || 0;
  const totalPages = Math.ceil(totalBooks / itemsPerPage);

  const [viewType, setViewType] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);

  const [favorites, setFavorites] = useState([]);

  // Available filter options
  const categories = [
    { id: "Fiction", name: "Fiction" },
    { id: "Non-Fiction", name: "Non-Fiction" },
    { id: "Science Fiction", name: "Science Fiction" },
    { id: "Fantasy", name: "Fantasy" },
    { id: "Mystery", name: "Mystery" },
    { id: "Thriller", name: "Thriller" },
    { id: "Romance", name: "Romance" },
    { id: "Historical Fiction", name: "Historical Fiction" },
    { id: "Contemporary", name: "Contemporary" },
    { id: "Young Adult", name: "Young Adult" },
    { id: "Middle Grade", name: "Middle Grade" },
    { id: "Children's", name: "Children's" },
    { id: "Biography & Autobiography", name: "Biography & Autobiography" },
    { id: "History", name: "History" },
    { id: "Science & Technology", name: "Science & Technology" },
    { id: "Mathematics", name: "Mathematics" },
    { id: "Social Sciences", name: "Social Sciences" },
    { id: "Psychology", name: "Psychology" },
    { id: "Self-Help", name: "Self-Help" },
    { id: "Business & Economics", name: "Business & Economics" },
    { id: "Travel", name: "Travel" },
    { id: "Cookbooks, Food & Wine", name: "Cookbooks, Food & Wine" },
    { id: "Art & Photography", name: "Art & Photography" },
    { id: "Religion & Spirituality", name: "Religion & Spirituality" },
    { id: "Philosophy", name: "Philosophy" },
    { id: "Poetry", name: "Poetry" },
    { id: "Drama", name: "Drama" },
    { id: "Comics & Graphic Novels", name: "Comics & Graphic Novels" },
    { id: "Education", name: "Education" },
    { id: "Reference", name: "Reference" },
  ];

  const formats = [
    { id: "hardcover", name: "Hardcover" },
    { id: "paperback", name: "Paperback" },
    { id: "ebook", name: "E-Book" },
    { id: "audio", name: "Audiobook" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rating" },
    { value: "bestseller", label: "Bestsellers" },
    { value: "title-asc", label: "Title: A-Z" },
    { value: "title-desc", label: "Title: Z-A" },
  ];

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  // Toggle format selection
  const toggleFormat = (formatId) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((id) => id !== formatId)
        : [...prev, formatId]
    );
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  // Update your handleSearch function in the search form
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedFormats([]);
    setPriceRange([0, 100]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (bookId) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  // Render star ratings
  const renderRating = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Add to Cart
  const dispatch = useDispatch();
  const addToCart = async (bookId) => {
    try {
      await dispatch(addToCartWithSync({ bookId, quantity: 1 }));
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="lg:px-28">
        <LoadingSkeleton type={"card"} count={4} />
      </div>
    );

  // Show error state
  if (isError) {
    return <ErrorMessage error={"Error loading books"} />;
  }
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-purple-700">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">Books</span>
          </div>

          <button
            className="md:hidden flex items-center text-sm gap-x-2 border border-gray-300 rounded-md px-2 py-1.5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-full md:w-64 md:mr-8 mb-6 md:mb-0">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Filter</h2>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="hidden" aria-hidden="true" />
                </form>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Format Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Format</h3>
                  <ul className="space-y-2">
                    {formats.map((format) => (
                      <li key={format.id}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={selectedFormats.includes(format.id)}
                            onChange={() => toggleFormat(format.id)}
                          />
                          <span className="text-sm text-gray-700">
                            {format.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange(0, e.target.value)
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full text-purple-600 underline text-sm mt-4 text-left"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Books</h1>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    className="bg-white border border-gray-300 text-sm rounded-md py-2 px-3 appearance-none pr-8 w-full"
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                </div>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-md overflow-hidden self-end sm:self-auto">
                  <button
                    className={`p-2 ${
                      viewType === "grid"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setViewType("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 ${
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

            {/* No Results */}
            {books.length === 0 && (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query.
                </p>
                <button
                  className="mt-4 text-purple-600 underline"
                  onClick={resetFilters}
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Book Grid View */}
            {viewType === "grid" && books.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {books.map((book) => (
                  <div key={book._id} className="group relative">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[2/3]">
                      <img
                        src={book.image || "/book-placeholder.jpg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 p-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className={`p-2 rounded-full shadow-md ${
                            favorites.includes(book._id)
                              ? "bg-purple-100 text-purple-600"
                              : "bg-white text-gray-500"
                          }`}
                          onClick={() => toggleFavorite(book._id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(book._id) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => addToCart(book._id)}
                          className="bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-purple-600"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        <Link to={`/books/${book._id}`}>{book.title}</Link>
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {book.author}
                      </p>
                      {book.averageRating && (
                        <div className="flex items-center mt-1">
                          {renderRating(book.averageRating)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({book.averageRating.toFixed(1)})
                          </span>
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="font-medium text-gray-900">
                          {formatPrice(book.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Book List View */}
            {viewType === "list" && books.length > 0 && (
              <div className="space-y-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="flex flex-col sm:flex-row gap-4 border-b pb-6"
                  >
                    <div className="w-full sm:w-32 flex-shrink-0">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[2/3]">
                        <img
                          src={book.image || "/book-placeholder.jpg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg text-gray-900">
                            <Link to={`/books/${book._id}`}>{book.title}</Link>
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {book.author}
                          </p>
                          {book.averageRating && (
                            <div className="flex items-center mt-2">
                              {renderRating(book.averageRating)}
                              <span className="text-xs text-gray-500 ml-1">
                                ({book.averageRating.toFixed(1)})
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {book.description}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="font-medium text-gray-900 text-lg">
                            {formatPrice(book.price)}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className={`p-2 rounded-full ${
                                favorites.includes(book._id)
                                  ? "text-purple-600"
                                  : "text-gray-400"
                              }`}
                              onClick={() => toggleFavorite(book._id)}
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  favorites.includes(book._id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => addToCart(book._id)}
                              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-500">
              <div className="mb-2 sm:mb-0">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalBooks)} of{" "}
                {totalBooks} books
              </div>
              <div className="flex items-center">
                <span className="mr-2">Show:</span>
                <select
                  className="bg-white border border-gray-300 rounded-md py-1 px-2"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                  <option value={32}>32</option>
                </select>
                <span className="ml-2">per page</span>
              </div>
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
