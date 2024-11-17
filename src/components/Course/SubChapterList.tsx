import { SubChapterData } from "@/models/front_models/CourseData";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface SubChapterListProps {
    subchapters: SubChapterData[];
    handleSubchapterSelect: (subChapter: SubChapterData) => void;
    handleCompletionChange: (subChapterId: number, completed: boolean) => void;
}

export const SubChapterList: React.FC<SubChapterListProps> = ({
                                                                  subchapters,
                                                                  handleSubchapterSelect,
                                                                  handleCompletionChange
                                                              }) => (
    <div className="pl-4 space-y-2">
        {subchapters.map((subchapter) => (
            <div
                key={subchapter.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
                <Checkbox
                    checked={subchapter.completed}
                    onCheckedChange={(checked) => handleCompletionChange(subchapter.id, checked as boolean)}
                    className="mr-2"
                />
                <div
                    className="flex-1 flex items-center space-x-2"
                    onClick={() => handleSubchapterSelect(subchapter)}
                >
                    <span className="text-sm text-gray-600">{`${subchapter.order}.`}</span>
                    <span>{subchapter.name}</span>
                </div>
            </div>
        ))}
    </div>
);