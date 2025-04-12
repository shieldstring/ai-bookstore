import React from 'react';
import { Star } from "lucide-react";

const ReviewForm = ({
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  reviewText,
  setReviewText,
  onSubmit,
  user
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        <span className="text-gray-600">
          {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Rate this book'}
        </span>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="review"
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this book..."
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;