import {Star} from "lucide-react";
import React from "react";

interface ChapterProps {
    order: number;
    name: string;
    review: number;
}
export const Chapter: React.FC<ChapterProps> = ({ order, name, review }) => (
    <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
            <span>{`${order}. ${name}`}</span>
        </div>
        <div className="flex justify-start mt-1">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < review ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-500">({review})</span>
            </div>
        </div>
    </div>
);