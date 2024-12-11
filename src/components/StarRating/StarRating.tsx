import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    ratingNumber: number;
    className?: string;
    onRatingChange?: (rating: number) => void; // opcjonalny callback
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, ratingNumber, className = "", onRatingChange }) => {
    const normalizedRating = Math.min(5, Math.max(0, rating));
    const roundedRating = Math.round(normalizedRating * 2) / 2;

    const handleClick = (position: number) => {
        if (onRatingChange) {
            onRatingChange(position + 1);
        }
    };

    const renderStar = (position: number) => {
        const starContent = roundedRating >= position + 1 ? (
            <Star
                className="text-yellow-400 fill-yellow-400"
                size={20}
            />
        ) : roundedRating >= position + 0.5 ? (
            <StarHalf
                className="text-yellow-400 fill-yellow-400"
                size={20}
            />
        ) : (
            <Star
                className="text-gray-300"
                size={20}
            />
        );

        return onRatingChange ? (
            <button
                key={position}
                onClick={() => handleClick(position)}
                className="focus:outline-none hover:scale-110 transition-transform"
            >
                {starContent}
            </button>
        ) : (
            <span key={position}>
            {starContent}
        </span>
        );
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