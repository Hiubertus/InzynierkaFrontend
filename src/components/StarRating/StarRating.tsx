import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    ratingNumber: number;
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, ratingNumber, className = "" }) => {
    const normalizedRating = Math.min(5, Math.max(0, rating));
    const roundedRating = Math.round(normalizedRating * 2) / 2;

    const renderStar = (position: number) => {
        if (roundedRating >= position + 1) {
            return (
                <Star
                    key={position}
                    className="text-yellow-400 fill-yellow-400"
                    size={20}
                />
            );
        } else if (roundedRating >= position + 0.5) {
            return (
                <StarHalf
                    key={position}
                    className="text-yellow-400 fill-yellow-400"
                    size={20}
                />
            );
        } else {
            return (
                <Star
                    key={position}
                    className="text-gray-300"
                    size={20}
                />
            );
        }
    };

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[0, 1, 2, 3, 4].map(position => renderStar(position))}
            <span className="ml-1 text-sm text-gray-600">
                {roundedRating.toFixed(1)} ({ratingNumber} {ratingNumber === 1 ? 'review' : 'reviews'})
            </span>
        </div>
    );
};