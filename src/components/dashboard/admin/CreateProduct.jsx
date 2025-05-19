import { useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  Package,
  Upload,
  Camera,
  Star,
  Info,
  Calendar,
  DollarSign,
  Package2,
  Globe,
  X,
} from "lucide-react";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";
import { useAddBookMutation } from "../../../redux/slices/bookSlice";

export default function CreateProduct({ onClose,  refetch }) {
  const [createProduct, { isLoading: isCreating }] = useAddBookMutation();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    publishedDate: "",
    description: "",
    price: "",
    originalPrice: "",
    inventory: "",
    pages: "",
    language: "English",
    category: "",
    format: "Paperback",
    dimensions: "",
    weight: "",
    image: "",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const bookCategories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Historical Fiction",
    "Contemporary",
    "Young Adult",
    "Middle Grade",
    "Children's",
    "Biography & Autobiography",
    "History",
    "Science & Technology",
    "Mathematics",
    "Social Sciences",
    "Psychology",
    "Self-Help",
    "Business & Economics",
    "Travel",
    "Cookbooks, Food & Wine",
    "Art & Photography",
    "Religion & Spirituality",
    "Philosophy",
    "Poetry",
    "Drama",
    "Comics & Graphic Novels",
    "Education",
    "Reference",
  ];

  const bookFormats = [
    "Paperback",
    "Hardcover",
    "E-book",
    "Audiobook",
    "Large Print",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Other",
  ];

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  /* ---------- Validation ---------- */
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.publisher.trim())
      newErrors.publisher = "Publisher is required";
    if (!formData.publishedDate)
      newErrors.publishedDate = "Published date is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Cover image is required";

    // Numeric validation
    if (isNaN(formData.price)) newErrors.price = "Price must be a number";
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be positive";

    if (formData.originalPrice && isNaN(formData.originalPrice)) {
      newErrors.originalPrice = "Original price must be a number";
    } else if (
      formData.originalPrice &&
      parseFloat(formData.originalPrice) <= 0
    ) {
      newErrors.originalPrice = "Original price must be positive";
    }

    if (isNaN(formData.inventory))
      newErrors.inventory = "Inventory must be a number";
    else if (parseInt(formData.inventory) < 0)
      newErrors.inventory = "Inventory cannot be negative";

    // ISBN validation
    const cleanIsbn = formData.isbn.replace(/[-\s]/g, "");
    if (!/^(?:\d{9}[\dXx]|\d{13})$/.test(cleanIsbn)) {
      newErrors.isbn = "Enter a valid 10- or 13-digit ISBN";
    }

    // Dimensions validation
    if (formData.dimensions) {
      const dimParts = formData.dimensions.split("×");
      if (dimParts.length !== 3) {
        newErrors.dimensions = "Enter dimensions as Height × Width × Thickness";
      } else if (dimParts.some((part) => isNaN(parseFloat(part.trim())))) {
        newErrors.dimensions = "All dimensions must be numbers";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Transform dimensions from string "H × W × T" to object
      const dimensions = formData.dimensions
        ? formData.dimensions.split("×").reduce((obj, val, i) => {
            const key = ["height", "width", "thickness"][i];
            obj[key] = parseFloat(val.trim());
            return obj;
          }, {})
        : undefined;

      // Prepare the complete book data
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        isbn: formData.isbn.replace(/[-\s]/g, ""), // Clean ISBN
        language: formData.language,
        format: formData.format,
        publishDate: formData.publishedDate, // Matches model field name
        publisher: formData.publisher.trim(),
        image: formData.image,
        category: formData.category,
        inventory: parseInt(formData.inventory),
        pageCount: formData.pages ? parseInt(formData.pages) : undefined,
        dimensions,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        featured: formData.featured,
        isActive: parseInt(formData.inventory) > 0, // Set based on inventory
      };

      console.log("Submitting book data:", bookData);
      const response = await createProduct(bookData).unwrap();
      console.log("Book created successfully:", response);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);

      // Reset form
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        publishedDate: "",
        description: "",
        price: "",
        originalPrice: "",
        inventory: "",
        pages: "",
        language: "English",
        category: "",
        format: "Paperback",
        dimensions: "",
        weight: "",
        image: "",
        featured: false,
      });

      refetch();
    } catch (err) {
      console.error("Book creation failed:", err);
      if (err.data?.errors) {
        // Handle field-specific errors from backend
        const fieldErrors = {};
        err.data.errors.forEach((error) => {
          fieldErrors[error.path] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: err.message || "Failed to create book" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className=" p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X className="h-6 w-6 text-slate-500" />
        </button>
      </div>
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-slate-800">
                  Add New Book Product
                </h1>
                <p className="text-slate-600 mt-1">
                  Create a new book entry for your catalog
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Step 1 of 1</p>
              <p className="text-xs text-slate-400">
                All required fields marked with *
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800">
                  Success!
                </h3>
                <p className="text-green-700">
                  Book has been successfully added to your catalog
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-6">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter the book title"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter the author's name"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.author
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.author && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.author}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ISBN */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        ISBN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        placeholder="978-3-16-148410-0"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.isbn
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                      {errors.isbn && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.isbn}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.category
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {bookCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter a detailed description of the book..."
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Publishing Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Publishing Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Publisher */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Publisher <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        placeholder="Enter publisher name"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.publisher
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                      {errors.publisher && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.publisher}
                        </p>
                      )}
                    </div>

                    {/* Published Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Published Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.publishedDate
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                      {errors.publishedDate && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.publishedDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Format */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Format
                      </label>
                      <select
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {bookFormats.map((fmt) => (
                          <option key={fmt} value={fmt}>
                            {fmt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pages */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Pages
                      </label>
                      <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        min="1"
                        placeholder="Number of pages"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.pages
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                      {errors.pages && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.pages}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dimensions */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Dimensions (L×W×H)
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        placeholder="e.g., 8 × 5 × 1 in"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Weight
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="e.g., 1.2 lb"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-5 w-5 text-emerald-500 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Pricing & Inventory
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.price
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Original Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Original Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.originalPrice
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    {errors.originalPrice && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.originalPrice}
                      </p>
                    )}
                  </div>

                  {/* inventory */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      inventory Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        name="inventory"
                        value={formData.inventory}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.inventory
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    {errors.inventory && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.inventory}
                      </p>
                    )}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.featured ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.featured ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <span className="text-sm font-medium text-slate-700 flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-1" />
                        Featured Product
                      </span>
                      <span className="text-xs text-slate-500">
                        Mark this book as a featured product
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Cover Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-6">
                  <Camera className="h-5 w-5 text-purple-500 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Cover Image
                  </h2>
                </div>

                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Image Preview */}
                  <div className="relative">
                    {formData.image ? (
                      <div className="relative group">
                        <img
                          src={formData.image}
                          alt="Book cover preview"
                          className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="p-4 bg-slate-100 rounded-full mb-4">
                          <Camera className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium mb-2">
                          Upload Book Cover
                        </p>
                        <p className="text-sm text-slate-400 text-center px-4">
                          Click to upload or drag and drop
                          <br />
                          PNG, JPG or WEBP (max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Uploading...
                      </>
                    ) : formData.image ? (
                      "Change Image"
                    ) : (
                      "Upload Image"
                    )}
                  </button>

                  {/* Image URL Display */}
                  {formData.image && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-600">
                        Image URL:
                      </p>
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border break-all">
                        {formData.image}
                      </p>
                    </div>
                  )}

                  {/* Error Display */}
                  {errors.image && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.image}
                    </p>
                  )}

                  {/* Upload Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      📸 Image Tips
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use high-quality images (min 300x400px)</li>
                      <li>• Keep file size under 5MB</li>
                      <li>• Square or portrait orientation works best</li>
                      <li>• Ensure good lighting and clear text</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Form Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Basic Information
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        formData.title &&
                        formData.author &&
                        formData.isbn &&
                        formData.category &&
                        formData.description
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formData.title &&
                      formData.author &&
                      formData.isbn &&
                      formData.category &&
                      formData.description
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Publishing Details
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        formData.publisher && formData.publishedDate
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formData.publisher && formData.publishedDate
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Pricing & Inventory
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        formData.price && formData.inventory !== ""
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formData.price && formData.inventory !== ""
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (formData.title &&
                        formData.author &&
                        formData.isbn &&
                        formData.category &&
                        formData.description
                          ? 33
                          : 0) +
                        (formData.publisher && formData.publishedDate
                          ? 33
                          : 0) +
                        (formData.price && formData.inventory !== "" ? 34 : 0)
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">
                  Ready to add this book to your catalog?
                </p>
                <p className="text-xs text-slate-400">
                  Make sure all required fields are filled out correctly.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: "",
                      author: "",
                      isbn: "",
                      publisher: "",
                      publishedDate: "",
                      description: "",
                      price: "",
                      originalPrice: "",
                      inventory: "",
                      pages: "",
                      language: "English",
                      category: "",
                      format: "Paperback",
                      dimensions: "",
                      weight: "",
                      image: "",
                      featured: false,
                    });
                    setErrors({});
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2 inline-block" />
                      Add Book to Catalog
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
