import { Star } from "lucide-react";
import { FC } from "react";
import {StarRating} from "@/components/StarRating/StarRating";

interface ChapterProps {
    order: number;
    name: string;
    review: number;
    reviewNumber: number;
}

export const Chapter: FC<ChapterProps> = ({ order, name, review, reviewNumber }) => (
    <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
            <span>{`${order}. ${name}`}</span>
        </div>
        <div className="flex justify-start mt-1">
            <div className="flex items-center">
                <StarRating rating={review} ratingNumber={reviewNumber} />
            </div>
        </div>
    </div>
);