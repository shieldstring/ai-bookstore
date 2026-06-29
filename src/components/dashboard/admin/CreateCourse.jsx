import React, { useRef, useState } from "react";
import {
  X,
  BookOpen,
  Camera,
  AlertCircle,
} from "lucide-react";
import { useAddCourseMutation } from "../../../redux/slices/courseApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../common/LoadingSpinner";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export default function CreateCourse({ onClose, refetch }) {
  const [addCourse, { isLoading }] = useAddCourseMutation();

  const [formData, setFormData] = useState({
    title: "",
    author: "", // maps to Instructor
    price: "",
    originalPrice: "",
    category: "",
    language: "English",
    publisher: "Self-Published", // Default organizer
    publishDate: new Date().toISOString().split("T")[0],
    description: "",
    image: "",
  });

  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activeSectionIndexForLesson, setActiveSectionIndexForLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    pdfUrl: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Education",
    "Business & Economics",
    "Science & Technology",
    "Self-Help",
    "Health & Fitness",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      console.error("Cover image upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Course title is required";
    if (!formData.author.trim()) newErrors.author = "Instructor name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Course description is required";
    if (!formData.image) newErrors.image = "Course banner/image is required";

    if (isNaN(formData.price)) newErrors.price = "Price must be a number";
    else if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be positive";

    if (formData.originalPrice && isNaN(formData.originalPrice)) {
      newErrors.originalPrice = "Original price must be a number";
    }

    if (sections.length === 0) {
      newErrors.sections = "A course syllabus must have at least one section";
    } else {
      const hasLessons = sections.some((s) => s.lessons && s.lessons.length > 0);
      if (!hasLessons) {
        newErrors.sections = "Your syllabus must contain at least one lesson";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        format: "Course",
        isbn: `COURSE-${Date.now()}`,
        inventory: 99999, // Infinite seats
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sections,
      };

      await addCourse(payload).unwrap();
      toast.success("Course curriculum created successfully!");
      refetch();
      onClose();
    } catch (err) {
      console.error("Failed to add course:", err);
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg relative p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            Create Online Course
          </h2>
          <p className="text-slate-500 text-xs mt-1">Configure your course syllabus, overview details, and pricing</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Course Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 pb-2 border-b border-slate-200">
                Course Basics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Master React in 30 Days"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {errors.title && <p className="text-red-500 text-xxs mt-0.5">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Instructor Name *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {errors.author && <p className="text-red-500 text-xxs mt-0.5">{errors.author}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xxs mt-0.5">{errors.category}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 49.99"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {errors.price && <p className="text-red-500 text-xxs mt-0.5">{errors.price}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Original Price ($) (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="e.g. 99.99"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {errors.originalPrice && <p className="text-red-500 text-xxs mt-0.5">{errors.originalPrice}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Course Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter a detailed description about the course goals, requirements, and curriculum topics..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
                {errors.description && <p className="text-red-500 text-xxs mt-0.5">{errors.description}</p>}
              </div>
            </div>

            {/* Curriculum Builder Card */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-700">Course Syllabus & Curriculum</h3>
                <span className="text-xxs text-slate-500 bg-slate-150 px-2 py-0.5 rounded-full font-medium">
                  {sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)} Lessons Added
                </span>
              </div>

              {errors.sections && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  {errors.sections}
                </div>
              )}

              {/* Add Section */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add Section Title (e.g. Section 1: Introduction to Framework)"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSectionTitle.trim()) return;
                    setSections([...sections, { title: newSectionTitle.trim(), lessons: [] }]);
                    setNewSectionTitle("");
                  }}
                  className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-semibold transition-colors"
                >
                  Add Section
                </button>
              </div>

              {/* Sections list */}
              <div className="space-y-4">
                {sections.map((section, sIndex) => (
                  <div key={sIndex} className="border border-slate-200 rounded-xl p-4 bg-slate-100/50 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-xs text-slate-700">
                        Section {sIndex + 1}: {section.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={sIndex === 0}
                          onClick={() => {
                            const newSecs = [...sections];
                            const temp = newSecs[sIndex];
                            newSecs[sIndex] = newSecs[sIndex - 1];
                            newSecs[sIndex - 1] = temp;
                            setSections(newSecs);
                          }}
                          className="px-1.5 py-0.5 border text-slate-500 bg-white rounded disabled:opacity-40 hover:bg-slate-50 cursor-pointer text-xxs font-bold"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={sIndex === sections.length - 1}
                          onClick={() => {
                            const newSecs = [...sections];
                            const temp = newSecs[sIndex];
                            newSecs[sIndex] = newSecs[sIndex + 1];
                            newSecs[sIndex + 1] = temp;
                            setSections(newSecs);
                          }}
                          className="px-1.5 py-0.5 border text-slate-500 bg-white rounded disabled:opacity-40 hover:bg-slate-50 cursor-pointer text-xxs font-bold"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSections(sections.filter((_, idx) => idx !== sIndex));
                            if (activeSectionIndexForLesson === sIndex) {
                              setActiveSectionIndexForLesson(null);
                            }
                          }}
                          className="text-red-500 hover:bg-red-50 px-2 py-0.5 rounded border border-transparent text-xxs font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Lessons nested */}
                    <div className="space-y-2">
                      {section.lessons && section.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center shadow-xxs">
                          <div className="text-xxs">
                            <p className="font-semibold text-slate-800">{lesson.title}</p>
                            <p className="text-slate-500 mt-0.5 flex gap-2">
                              {lesson.videoUrl && <span>🎥 Lecture Video</span>}
                              {lesson.pdfUrl && <span>📄 Handout Guide</span>}
                              {lesson.duration && <span className="text-slate-400">⏱ {lesson.duration}</span>}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={lIndex === 0}
                              onClick={() => {
                                const newSecs = [...sections];
                                const newLessons = [...newSecs[sIndex].lessons];
                                const temp = newLessons[lIndex];
                                newLessons[lIndex] = newLessons[lIndex - 1];
                                newLessons[lIndex - 1] = temp;
                                newSecs[sIndex] = { ...newSecs[sIndex], lessons: newLessons };
                                setSections(newSecs);
                              }}
                              className="px-1 py-0.5 bg-white border rounded text-slate-500 disabled:opacity-40 hover:bg-slate-50 text-xxs font-bold"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={lIndex === section.lessons.length - 1}
                              onClick={() => {
                                const newSecs = [...sections];
                                const newLessons = [...newSecs[sIndex].lessons];
                                const temp = newLessons[lIndex];
                                newLessons[lIndex] = newLessons[lIndex + 1];
                                newLessons[lIndex + 1] = temp;
                                newSecs[sIndex] = { ...newSecs[sIndex], lessons: newLessons };
                                setSections(newSecs);
                              }}
                              className="px-1 py-0.5 bg-white border rounded text-slate-500 disabled:opacity-40 hover:bg-slate-50 text-xxs font-bold"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newSecs = [...sections];
                                const newLessons = newSecs[sIndex].lessons.filter((_, idx) => idx !== lIndex);
                                newSecs[sIndex] = { ...newSecs[sIndex], lessons: newLessons };
                                setSections(newSecs);
                              }}
                              className="text-red-500 hover:bg-red-50 px-1 py-0.5 rounded text-xxs font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!section.lessons || section.lessons.length === 0) && (
                        <p className="text-xxs text-slate-400 italic text-center py-2 bg-white rounded border border-dashed border-slate-200">
                          No lessons added yet.
                        </p>
                      )}
                    </div>

                    {/* Lesson Inline Creator */}
                    {activeSectionIndexForLesson === sIndex ? (
                      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3 shadow-xs">
                        <p className="text-xs font-semibold text-slate-800">Add Syllabus Lesson</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Lesson Title *"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 focus:outline-none rounded text-xxs focus:ring-1 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="Lecture Video Link (YouTube/Vimeo/S3)"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 focus:outline-none rounded text-xxs focus:ring-1 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="PDF Handout URL (Optional)"
                            value={lessonForm.pdfUrl}
                            onChange={(e) => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 focus:outline-none rounded text-xxs focus:ring-1 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="Lesson Duration (e.g. 05:45)"
                            value={lessonForm.duration}
                            onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 focus:outline-none rounded text-xxs focus:ring-1 focus:ring-purple-500"
                          />
                          <textarea
                            placeholder="Lesson written summary description..."
                            value={lessonForm.content}
                            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                            rows={3}
                            className="px-3 py-1.5 border border-slate-200 focus:outline-none rounded text-xxs md:col-span-2 resize-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        <div className="flex justify-end gap-2 text-xxs pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveSectionIndexForLesson(null)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!lessonForm.title.trim()) return;
                              const newSecs = [...sections];
                              newSecs[sIndex].lessons.push({ ...lessonForm });
                              setSections(newSecs);
                              setLessonForm({ title: "", content: "", videoUrl: "", pdfUrl: "", duration: "" });
                              setActiveSectionIndexForLesson(null);
                            }}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium cursor-pointer"
                          >
                            Save Lesson
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSectionIndexForLesson(sIndex);
                          setLessonForm({ title: "", content: "", videoUrl: "", pdfUrl: "", duration: "" });
                        }}
                        className="w-full py-1.5 border border-dashed border-slate-350 hover:border-slate-400 bg-white hover:bg-slate-50 text-xxs font-bold text-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        + Add Lesson
                      </button>
                    )}
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="text-xxs text-slate-400 italic text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    Add a syllabus section above to build your curriculum module contents.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Image Cover upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 pb-2 border-b border-slate-200">
                Course Banner Image
              </h3>
              
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {formData.image ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
                    <img
                      src={formData.image}
                      alt="Course Banner"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-slate-750 hover:scale-105 transition-transform"
                      >
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-44 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl flex flex-col items-center justify-center bg-slate-50 text-slate-500 transition-colors gap-2 cursor-pointer"
                  >
                    {uploading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-slate-400" />
                        <span className="text-xxs font-bold uppercase tracking-wider">Upload Course Banner</span>
                        <span className="text-xxs text-slate-400">16:9 Aspect Ratio recommended</span>
                      </>
                    )}
                  </button>
                )}
                {errors.image && <p className="text-red-500 text-xxs text-center">{errors.image}</p>}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {isLoading ? <LoadingSpinner /> : "Publish Course"}
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
