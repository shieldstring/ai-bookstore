import React from 'react';
import { Star } from "lucide-react";

const ReviewForm = ({
  rating,
  setRating,
  reviewText,
  setReviewText,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      <form onSubmit={onSubmit}>
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
          <span>{rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Rate'}</span>
        </div>
        
        <div className="mb-4">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 border rounded"
            rows="4"
            placeholder="Share your thoughts..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;