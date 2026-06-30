import React, { useEffect, useState } from "react";
import { Star, ShoppingCart, Video, ShieldCheck, Clock, BookOpen, User, Store } from "lucide-react";
import Newsletter from "../components/common/Newsletter";
import ValueProps from "../components/common/ValueProps";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import ReviewList from "../components/bookDetails/ReviewList";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReviewForm from "../components/bookDetails/ReviewForm";
import { useGetCourseDetailsQuery } from "../redux/slices/courseApiSlice";
import { useAddReviewMutation } from "../redux/slices/bookSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "../components/preloader/LoadingSkeleton";
import FormattedDate from "../components/FormattedDate";
import { toast } from "react-toastify";
import { addToCartWithSync } from "../redux/slices/cartThunks";
import { useGetSellerStorefrontQuery } from "../redux/slices/sellerApiSlice";
import { useGetEnrollmentQuery } from "../redux/slices/enrollmentApiSlice";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState("syllabus");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { data, isLoading, isError, error, refetch } = useGetCourseDetailsQuery(id);
  const [addReview] = useAddReviewMutation();

  const course = data?.data;

  // Check enrollment
  const { data: enrollmentData } = useGetEnrollmentQuery(id, {
    skip: !userInfo || !course,
  });
  const isEnrolled = !!enrollmentData?.data;

  // Instructor Info
  const { data: seller } = useGetSellerStorefrontQuery(course?.seller, {
    skip: !course?.seller,
  });
  const sellerProfile = seller?.data?.sellerProfile;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  }, [refetch, id]);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(
        addToCartWithSync({
          bookId: id,
          quantity: 1,
          price: course.price,
          name: course.title,
          title: course.title,
          image: course.image,
          author: course.author,
          format: "Course",
        })
      ).unwrap();
      toast.success("Added course to cart successfully!");
      navigate("/cart");
    } catch (err) {
      toast.error(err || "Failed to add course to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await addReview({
        bookId: id,
        rating,
        text: reviewText,
      }).unwrap();
      setRating(0);
      setReviewText("");
      toast.success("Review submitted successfully!");
      refetch();
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <LoadingSkeleton type="page" />
      </div>
    );
  }

  if (isError || !course) {
    return <ErrorMessage error={error || "Course details could not be found."} />;
  }

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const courseRating = course.averageRating || 4.8;

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title={`${course.title} | Course Syllabus`}
        description={course.description}
        image={course.image}
        name="AI Bookstore"
        type="website"
      />

      <PageHero
        variant="compact"
        eyebrow="Course Syllabus"
        title={course.title}
        subtitle={`Instructor: ${course.author}`}
        backgroundImage={course.image}
        align="left"
        overlayClass="bg-gradient-to-r from-black/88 via-purple-950/82 to-black/75"
        minHeight="min-h-[240px] md:min-h-[280px]"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Courses", to: "/courses" },
          { label: course.title?.length > 40 ? `${course.title.slice(0, 40)}…` : course.title },
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl -mt-2 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Course Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-4">
              <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full text-xxs uppercase tracking-wider border border-purple-100">
                {course.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4 text-purple-650" />
                  Instructor: <span className="text-slate-850 font-semibold">{course.author}</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Video className="h-4 w-4 text-purple-650" />
                  {totalLessons} Lectures
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  {courseRating.toFixed(1)} ({course.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab("syllabus")}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
                    activeTab === "syllabus" ? "bg-white text-purple-700" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Syllabus
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
                    activeTab === "reviews" ? "bg-white text-purple-700" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Reviews ({course.reviewCount || 0})
                </button>
              </div>

              <div className="p-6">
                
                {/* Syllabus tab rendering */}
                {activeTab === "syllabus" && (
                  <div className="space-y-4">
                    {course.sections && course.sections.length > 0 ? (
                      course.sections.map((section, sIdx) => (
                        <div key={sIdx} className="border border-slate-150 rounded-xl overflow-hidden shadow-2xs">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-150 flex justify-between items-center">
                            <h4 className="font-bold text-slate-800 text-sm">
                              Section {sIdx + 1}: {section.title}
                            </h4>
                            <span className="text-xxs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                              {section.lessons?.length || 0} lessons
                            </span>
                          </div>
                          <div className="divide-y divide-slate-100 bg-white">
                            {section.lessons && section.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="px-5 py-3 flex justify-between items-center text-xs text-slate-650">
                                <span className="flex items-center gap-2">
                                  <Video className="h-3.5 w-3.5 text-slate-400" />
                                  {lesson.title}
                                </span>
                                {lesson.duration && (
                                  <span className="text-slate-400 font-medium">{lesson.duration}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <BookOpen className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-sm">No syllabus uploaded yet</p>
                        <p className="text-xxs text-slate-400 mt-0.5">The instructor hasn't set up the lecture syllabus modules.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews tab rendering */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {userInfo ? (
                      <ReviewForm
                        rating={rating}
                        setRating={setRating}
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                        onSubmit={handleReviewSubmit}
                        user={userInfo}
                      />
                    ) : (
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                        <p className="text-purple-800 text-xs font-semibold">
                          Please <Link to="/login" className="underline font-bold">Sign In</Link> to write a course evaluation review.
                        </p>
                      </div>
                    )}
                    <ReviewList reviews={course.reviews} />
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Pricing & Checkout Side Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Purchase Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-5 sticky top-6">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">${course.price?.toFixed(2)}</span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="line-through text-xs text-slate-400 font-medium">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Full lifetime digital syllabus video player access</p>
              </div>

              {isEnrolled ? (
                <Link
                  to={`/dashboard/courses/${id}`}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-center font-bold text-xs shadow-sm flex items-center justify-center cursor-pointer"
                >
                  Go to Course Player
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAdding ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <ShoppingCart className="h-4.5 w-4.5" />
                      ENROLL IN COURSE
                    </>
                  )}
                </button>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xxs text-slate-400 font-bold uppercase tracking-wider justify-center">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                30-Day Money Back Guarantee
              </div>
            </div>

          </div>

        </div>
      </div>

      <ValueProps />
      <Newsletter />
    </div>
  );
}
