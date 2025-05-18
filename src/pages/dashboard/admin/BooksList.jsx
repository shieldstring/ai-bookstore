import { useState, useEffect } from 'react';
import { Book, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetProductsQuery, useDeleteProductMutation } from '../../../redux/slices/productsApiSlice';
import CreateProduct from '../../../components/dashboard/admin/CreateProduct';
import EditProduct from '../../../components/dashboard/admin/EditProduct';


const BooksList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Query params for the API
  const queryParams = {
    page,
    limit,
    genre,
    sortBy,
    search: searchQuery
  };

  const { data, isLoading, isFetching, error } = useGetProductsQuery(queryParams);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Execute search when user presses Enter
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(search);
      setPage(1); // Reset to first page when searching
    }
  };

  // Handle filter and sort changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'genre') setGenre(value);
    if (name === 'sortBy') setSortBy(value);
    setPage(1); // Reset to first page when filters change
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteProduct({ id }).unwrap();
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (data && page < data.pages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const books = data?.data || [];
  const totalPages = data?.pages || 0;

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> Unable to load books. Please try again later.</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Books</h2>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search books..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </div>
          <select
            name="genre"
            value={genre}
            onChange={handleFilterChange}
            className="py-2 px-4 border border-gray-300 rounded-md"
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-fiction</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="fantasy">Fantasy</option>
            <option value="mystery">Mystery</option>
            <option value="biography">Biography</option>
          </select>
          <select
            name="sortBy"
            value={sortBy}
            onChange={handleFilterChange}
            className="py-2 px-4 border border-gray-300 rounded-md"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="rating">Highest Rated</option>
            <option value="bestseller">Best Sellers</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {book.image ? (
                      <img 
                        src={book.image} 
                        alt={book.title} 
                        className="h-10 w-10 object-cover rounded-md mr-4" 
                      />
                    ) : (
                      <Book className="flex-shrink-0 h-10 w-10 text-purple-500 mr-4" />
                    )}
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${book.price?.toFixed(2)}
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="line-through ml-2 text-gray-400">
                      ${book.originalPrice.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    book.inventory > 10 ? 'bg-green-100 text-green-800' : 
                    book.inventory > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {book.inventory} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => setEditingProductId(book._id)}
                    className="text-purple-600 hover:text-purple-900 mr-3"
                    title="Edit book"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(book._id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting}
                    title="Delete book"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && !isLoading && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No books found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, data?.total || 0)}
                </span>{' '}
                of <span className="font-medium">{data?.total || 0}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  // Show max 5 page numbers
                  const pageNum = i + 1 + Math.max(0, page - 3);
                  return pageNum <= totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === pageNum 
                          ? 'bg-purple-100 border-purple-500 text-purple-700' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CreateProduct
            onClose={() => setShowCreateModal(false)}
          />
        </div>
      )}

      {editingProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <EditProduct 
            productId={editingProductId}
            onClose={() => setEditingProductId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default BooksList;