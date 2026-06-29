import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText
} from "lucide-react";
import CreateCourse from "../../../components/dashboard/admin/CreateCourse";
import EditCourse from "../../../components/dashboard/admin/EditCourse";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SEO from "../../../components/SEO";
import { useSelector } from "react-redux";
import {
  useDeleteBookMutation,
  useGetBookListsQuery,
  useGetSellerBooksQuery,
} from "../../../redux/slices/bookSlice";

const CoursesList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState([]);

  // Query params for public/admin listing
  const queryParams = {
    page,
    limit,
    category,
    sortBy,
    search: searchQuery,
    format: "Course"
  };

  const { userInfo } = useSelector((state) => state.auth);
  const isSeller = userInfo?.role === "seller";

  const {
    data: listData,
    isLoading: isListLoading,
    refetch: refetchList,
    isFetching: isListFetching,
    error: listError,
  } = useGetBookListsQuery(queryParams, { skip: isSeller });

  const {
    data: sellerData,
    isLoading: isSellerLoading,
    refetch: refetchSeller,
    isFetching: isSellerFetching,
    error: sellerError,
  } = useGetSellerBooksQuery(undefined, { skip: !isSeller });

  const data = isSeller ? sellerData : listData;
  const isLoading = isSeller ? isSellerLoading : isListLoading;
  const isFetching = isSeller ? isSellerFetching : isListFetching;
  const error = isSeller ? sellerError : listError;
  const refetch = isSeller ? refetchSeller : refetchList;

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteBookMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Trigger refetch on mount or query updates
  useEffect(() => {
    refetch();
  }, [refetch, searchQuery, category, sortBy, page]);

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Execute search when user presses Enter
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(search);
      setPage(1); // Reset to first page when searching
    }
  };

  // Handle filter and sort changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setCategory(value);
    if (name === "sortBy") setSortBy(value);
    setPage(1); // Reset to first page when filters change
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete course:", error);
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

  // Filter to ensure only Course formats are listed
  const courses = (data?.data || []).filter((item) => item.format === "Course");
  const totalPages = isSeller ? 1 : (data?.pages || 0);

  if (isLoading || isFetching)
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 w-48 bg-slate-200 animate-pulse rounded mb-6"></div>
        <LoadingSkeleton type={"list"} count={5} />
      </div>
    );

  if (error)
    return (
      <ErrorMessage error={"Unable to load courses. Please try again later"} />
    );

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <SEO
        title="Manage Courses"
        description="LMS Dashboard for listing, organizing, and editing interactive online courses."
        name="BookStore"
        type="description"
      />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Courses</h2>
          <p className="text-slate-500 text-xs mt-1">Sellers dashboard to configure lectures, uploads, and curriculum syllabi</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-60 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </div>
          <select
            name="category"
            value={category}
            onChange={handleFilterChange}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm text-slate-700 bg-white"
          >
            <option value="">All Categories</option>
            <option value="Education">Education</option>
            <option value="Business & Economics">Business & Economics</option>
            <option value="Science & Technology">Science & Technology</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Health & Fitness">Health & Fitness</option>
          </select>
          <select
            name="sortBy"
            value={sortBy}
            onChange={handleFilterChange}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm text-slate-700 bg-white"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="rating">Highest Rated</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 font-semibold text-sm transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Curriculum Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => {
              const totalSections = course.sections?.length || 0;
              const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;

              return (
                <tr key={course._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-10 w-16 object-cover rounded-md mr-4 shadow-sm border border-slate-100"
                        />
                      ) : (
                        <div className="h-10 w-16 bg-purple-50 rounded-md mr-4 flex items-center justify-center border border-purple-100 text-purple-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                      <div className="text-sm font-semibold text-slate-800">
                        {truncate(course.title, 40)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                    ${course.price?.toFixed(2)}
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="line-through ml-2 text-xs text-gray-400 font-normal">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        {totalSections} Sections
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        {totalLessons} Lessons
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingProductId(course._id);
                        setDetails(course);
                      }}
                      className="text-purple-600 hover:text-purple-900 mr-4 cursor-pointer"
                      title="Edit Course Curriculum"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      disabled={isDeleting}
                      title="Delete Course"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {courses.length === 0 && !isLoading && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">No courses found</p>
                  <p className="text-xs text-slate-400 mt-1">Start by creating your first course curriculum!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(page * limit, data?.total || 0)}
                </span>{" "}
                of <span className="font-medium">{data?.total || 0}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === pageNum
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    page >= totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Course Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CreateCourse
              onClose={() => setShowCreateModal(false)}
              refetch={refetch}
            />
          </div>
        </div>
      )}

      {editingProductId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <EditCourse
              productId={editingProductId}
              details={details}
              onClose={() => setEditingProductId(null)}
              refetch={refetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
