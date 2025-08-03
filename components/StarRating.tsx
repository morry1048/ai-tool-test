
import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps): React.ReactNode {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-6 h-6 ${
              starValue <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        );
      })}
    </div>
  );
}
