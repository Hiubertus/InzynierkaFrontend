import {FC, useMemo} from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChapterData, SubChapterData } from "@/models/front_models/CourseData";
import { Chapter } from "@/components/Course/Chapter";
import { SubChapterList } from "@/components/Course/SubChapterList";

interface ChapterAccordionProps {
    chapters: ChapterData[];
    handleSubchapterSelect?: (subChapter: SubChapterData) => void;
}

export const ChapterAccordionPreview: FC<ChapterAccordionProps> = ({ chapters, handleSubchapterSelect }) => {
    const sortedChapters = useMemo(
        () => [...chapters].sort((a, b) => a.order - b.order),
        [chapters]
    );

    return (
        <Accordion type="single" collapsible className="w-full">
            {sortedChapters.map((chapter) => {
                const hasSubchapters = chapter.subchapters && chapter.subchapters.length > 0;

                if (hasSubchapters) {
                    return (
                        <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                            <AccordionTrigger>
                                <Chapter
                                    order={chapter.order}
                                    name={chapter.name}
                                />
                            </AccordionTrigger>
                            <AccordionContent>
                                <SubChapterList
                                    handleSubchapterSelect={handleSubchapterSelect}
                                    subchapters={chapter.subchapters.sort((a, b) => a.order - b.order)}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                }

                return (
                    <div key={chapter.id} className="py-4">
                        <Chapter
                            order={chapter.order}
                            name={chapter.name}
                        />
                    </div>
                );
            })}
        </Accordion>
    );
};