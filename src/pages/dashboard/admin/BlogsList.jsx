import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import CreateBlog from "../../../components/dashboard/admin/CreateBlog";
import EditBlog from "../../../components/dashboard/admin/EditBlog";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SEO from "../../../components/SEO";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation
} from "../../../redux/slices/blogApiSlice";
import { toast } from "react-toastify";

const BlogsList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = {
    page,
    limit,
    category,
    search: searchQuery,
    showDrafts: true, // Admin should see everything
  };

  const {
    data,
    isLoading,
    refetch,
    isFetching,
    error,
  } = useGetBlogsQuery(queryParams);

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingBlogDetails, setEditingBlogDetails] = useState(null);

  // Confirm delete modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch, searchQuery, category, page]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(search);
      setPage(1);
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      await updateBlog({
        blogId: blog._id,
        data: { isActive: !blog.isActive }
      }).unwrap();
      toast.success(`Article status updated successfully!`);
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle delete with confirmation modal trigger
  const handleDelete = (id) => {
    setBlogIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (blogIdToDelete) {
      try {
        await deleteBlog(blogIdToDelete).unwrap();
        toast.success("Blog post deleted successfully!");
        refetch();
      } catch (error) {
        console.error("Failed to delete blog post:", error);
        toast.error("Failed to delete article");
      }
    }
    setIsConfirmOpen(false);
    setBlogIdToDelete(null);
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (isLoading || isFetching) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 w-48 bg-slate-200 animate-pulse rounded mb-6"></div>
        <LoadingSkeleton type={"list"} count={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={"Unable to load blogs. Please try again later"} />;
  }

  const blogs = data?.data || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <SEO
        title="Manage Blogs"
        description="Admin dashboard page to publish and moderate news, announcements, and articles."
        name="BookStore"
        type="description"
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Blog Posts</h2>
          <p className="text-slate-500 text-xs mt-1">Publish book updates, reading tips, announcements, and guides</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-60 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm text-slate-700 bg-white"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Tips">Tips</option>
            <option value="Benefits">Benefits</option>
            <option value="Lists">Lists</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Industry News">Industry News</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Read Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Publish Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="h-10 w-16 object-cover rounded-md mr-4 shadow-sm border border-slate-100"
                      />
                    ) : (
                      <div className="h-10 w-16 bg-purple-50 rounded-md mr-4 flex items-center justify-center border border-purple-100 text-purple-600">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                    <div className="text-sm font-semibold text-slate-800">
                      {truncate(blog.title, 40)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.authorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.readTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                      blog.isActive
                        ? "bg-green-50 text-green-700 border border-green-150"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {blog.isActive ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(blog)}
                    className="text-slate-500 hover:text-slate-900 mr-4 cursor-pointer"
                    title={blog.isActive ? "Save to Drafts" : "Publish Live"}
                  >
                    {blog.isActive ? (
                      <EyeOff className="h-5 w-5 inline" />
                    ) : (
                      <Eye className="h-5 w-5 inline" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingBlogId(blog._id);
                      setEditingBlogDetails(blog);
                    }}
                    className="text-purple-600 hover:text-purple-900 mr-4 cursor-pointer"
                    title="Edit Blog Post"
                  >
                    <Edit className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    disabled={isDeleting}
                    title="Delete Blog"
                  >
                    <Trash2 className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">No blog posts found</p>
                  <p className="text-xs text-slate-400 mt-1">Start by creating your first article post!</p>
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
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === i + 1
                        ? "bg-purple-100 border-purple-500 text-purple-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => page < totalPages && setPage(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                    page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <CreateBlog
            onClose={() => setShowCreateModal(false)}
            refetch={refetch}
          />
        </div>
      )}

      {editingBlogId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <EditBlog
            blogId={editingBlogId}
            details={editingBlogDetails}
            onClose={() => setEditingBlogId(null)}
            refetch={refetch}
          />
        </div>
      )}

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setBlogIdToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default BlogsList;
