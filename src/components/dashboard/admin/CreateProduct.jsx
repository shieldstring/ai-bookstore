import { useRef, useState } from "react";
import { useCreateProductMutation } from "../../../redux/slices/productsApiSlice";
import { AlertCircle, BookOpen, Check, Package, Upload } from "lucide-react";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export default function CreateProduct() {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    publishedDate: "",
    description: "",
    price: "",
    stock: "",
    pages: "",
    language: "English",
    category: "",
    format: "Paperback",
    dimensions: "",
    weight: "",
    coverImage: "",
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
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Children",
    "Young Adult",
    "Science",
    "Travel",
    "Poetry",
    "Reference",
    "Art",
    "Cooking",
    "Education",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error on change
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setFormData({
        ...formData,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally show error to user
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.publisher.trim())
      newErrors.publisher = "Publisher is required";
    if (!formData.publishedDate.trim())
      newErrors.publishedDate = "Published date is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Numeric validation
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    if (
      formData.pages &&
      (isNaN(parseInt(formData.pages)) || parseInt(formData.pages) <= 0)
    ) {
      newErrors.pages = "Pages must be a positive number";
    }

    // ISBN validation (basic check for now - typically 10 or 13 digits)
    const isbnPattern = /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$/;
    if (
      formData.isbn &&
      !isbnPattern.test(formData.isbn.replace(/[-\s]/g, ""))
    ) {
      newErrors.isbn = "Please enter a valid 10 or 13-digit ISBN";
    }

    // URL validation for cover image
    if (formData.coverImage && !/^https?:\/\/.*/.test(formData.coverImage)) {
      newErrors.coverImage = "Please enter a valid URL for cover image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log("Form submitted:", formData);
      setSubmitted(true);

      // Reset form after submission (optional)
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          title: "",
          author: "",
          isbn: "",
          publisher: "",
          publishedDate: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          pages: "",
          language: "English",
          category: "",
          format: "Paperback",
          dimensions: "",
          weight: "",
          image: "",
          featured: false,
        });
      }, 3000);
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <BookOpen className="mr-2 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Book Product
        </h1>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <Check className="text-green-500 mr-2" />
          <p className="text-green-700">
            Book successfully added to inventory!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.author ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.author}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g., 978-3-16-148410-0"
                className={`w-full p-2 border rounded-md ${
                  errors.isbn ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.isbn}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {bookCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format <span className="text-red-500">*</span>
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {bookFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full p-2 border rounded-md ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full p-2 border rounded-md ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full p-2 border rounded-md ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Publishing Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Publishing Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.publisher ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.publisher && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.publisher}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.publishedDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.publishedDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.publishedDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pages
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md ${
                  errors.pages ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.pages && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.pages}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions (LxWxH)
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="e.g., 8 x 5 x 1 inches"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 1.2 lbs"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center space-x-4">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="productImage"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
              {formData.image && (
                <p className="mt-2 text-xs text-gray-500 truncate">
                  {formData.image}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full p-2 border rounded-md ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Book to Inventory
          </button>
        </div>
      </form>
    </div>
  );
}
