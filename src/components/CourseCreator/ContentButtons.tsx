import {Button} from "@/components/ui/button";
import {Camera, ClipboardList, Film, Type} from "lucide-react";
import React from "react";

interface ContentButtonsProps {
    chapterId: number;
    subchapterId: number;
    addContentToSubChapter: (chapterId: number, subChapterId: number, contentType: 'text' | 'video' | 'image' | 'quiz') => void;
}

export const ContentButtons: React.FC<ContentButtonsProps> = ({
                                                                  chapterId,
                                                                  subchapterId,
                                                                  addContentToSubChapter
                                                              }) => {
    return (<div className="flex space-x-2 pt-4">
        <Button
            onClick={() => addContentToSubChapter(chapterId, subchapterId, 'text')}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Type size={18} className="mr-1"/>
            Text
        </Button>
        <Button
            onClick={() => addContentToSubChapter(chapterId, subchapterId, 'image')}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Camera size={18} className="mr-1"/>
            Image
        </Button>
        <Button
            onClick={() => addContentToSubChapter(chapterId, subchapterId, 'video')}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Film size={18} className="mr-1"/>
            Video
        </Button>
        <Button
            onClick={() => addContentToSubChapter(chapterId, subchapterId, 'quiz')}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <ClipboardList size={18} className="mr-1"/>
            Quiz
        </Button>
    </div>)
}