import React, { useRef, useState } from "react";
import {
  X,
  FileText,
  Camera
} from "lucide-react";
import { useCreateBlogMutation } from "../../../redux/slices/blogApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../common/LoadingSpinner";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export default function CreateBlog({ onClose, refetch }) {
  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    authorName: "",
    category: "General",
    readTime: "5 min read",
    imageUrl: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "General",
    "Tips",
    "Benefits",
    "Lists",
    "Mental Health",
    "Industry News",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const uploadedUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success("Cover image uploaded successfully!");
    } catch (err) {
      console.error("Cover upload failed:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Article title is required";
    if (!formData.summary.trim()) newErrors.summary = "Article summary excerpt is required";
    if (!formData.content.trim()) newErrors.content = "Article body content is required";
    if (!formData.authorName.trim()) newErrors.authorName = "Author display name is required";
    if (!formData.imageUrl) newErrors.imageUrl = "Cover banner image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createBlog(formData).unwrap();
      toast.success("Blog article published successfully!");
      refetch();
      onClose();
    } catch (err) {
      console.error("Failed to publish blog:", err);
      toast.error(err?.data?.message || "Failed to publish article");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg relative p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            Create Blog Post
          </h2>
          <p className="text-slate-500 text-xs mt-1">Compose official bookstore blogs, guides, and updates</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Blog Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. 10 Books That Will Transform Your Perspective"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                {errors.title && <p className="text-red-500 text-xxs mt-0.5">{errors.title}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Summary Excerpt *</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Provide a quick introductory snippet to show on search indexes..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
                {errors.summary && <p className="text-red-500 text-xxs mt-0.5">{errors.summary}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Article Body Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="Compose your article details here. Standard paragraphs and breaks are supported..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 resize-y font-sans leading-relaxed"
                />
                {errors.content && <p className="text-red-500 text-xxs mt-0.5">{errors.content}</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata and Cover */}
          <div className="lg:col-span-1 space-y-6">
            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 pb-2 border-b border-slate-200">
                Metadata Settings
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Author Display Name *</label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="e.g. Maria Smith"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {errors.authorName && <p className="text-red-500 text-xxs mt-0.5">{errors.authorName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Est. Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                    Publish instantly (visible to public)
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 pb-2 border-b border-slate-200">
                Cover Banner
              </h3>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {formData.imageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
                    <img
                      src={formData.imageUrl}
                      alt="Blog Banner Cover"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-slate-800 hover:scale-105 transition-transform"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-36 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl flex flex-col items-center justify-center bg-slate-50 text-slate-500 transition-colors gap-1.5 cursor-pointer"
                  >
                    {uploading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Camera className="h-6 w-6 text-slate-400" />
                        <span className="text-xxs font-bold uppercase tracking-wider">Upload Cover Image</span>
                        <span className="text-xxs text-slate-400">16:9 Landscape ratio</span>
                      </>
                    )}
                  </button>
                )}
                {errors.imageUrl && <p className="text-red-500 text-xxs text-center">{errors.imageUrl}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center cursor-pointer"
              >
                {isLoading ? <LoadingSpinner /> : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
