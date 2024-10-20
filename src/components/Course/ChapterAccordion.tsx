import React, { useMemo } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChapterData, SubChapterData } from "@/models/CourseData";
import { Chapter } from "@/components/Course/Chapter";
import { SubChapterList } from "@/components/Course/SubChapterList";

interface ChapterAccordionProps {
    chapters: ChapterData[];
    handleSubchapterSelect: (subChapter: SubChapterData) => void;
    handleCompletionChange: (subChapterId: number, completed: boolean) => void;
}

export const ChapterAccordion: React.FC<ChapterAccordionProps> = ({ chapters, handleSubchapterSelect, handleCompletionChange } ) => {
    const sortedChapters = useMemo(
        () => [...chapters].sort((a, b) => a.order - b.order),
        [chapters]
    );

    return (
        <Accordion type="single" collapsible className="w-full">
            {sortedChapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                    <AccordionTrigger>
                        <Chapter order={chapter.order} name={chapter.name} review={chapter.review} />
                    </AccordionTrigger>
                    <AccordionContent>
                        <SubChapterList handleSubchapterSelect={handleSubchapterSelect} handleCompletionChange={handleCompletionChange} subchapters={chapter.subchapters.sort((a, b) => a.order - b.order)} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};