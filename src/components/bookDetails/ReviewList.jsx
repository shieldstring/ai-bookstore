import React from 'react';
import { Star } from "lucide-react";

export default function ReviewList() {
  return (
    <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden"></div>
                          <div>
                            <h4 className="font-medium">{review.name}</h4>
                            <div className="text-xs text-gray-600">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-300"}
                              size={16}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
  )
}
