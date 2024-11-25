import {FC, useMemo, useState} from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ChapterData, SubChapterData } from "@/models/front_models/CourseData"
import { Chapter } from "@/components/Course/Chapter"
import { SubChapterList } from "@/components/Course/SubChapterList"

interface ChapterAccordionProps {
    chapters: ChapterData[]
    handleSubchapterSelect?: (subChapter: SubChapterData) => void
    handleChapterSelect?: (chapterId: number) => void
}

export const ChapterAccordion: FC<ChapterAccordionProps> = ({
                                                                chapters,
                                                                handleSubchapterSelect,
                                                                handleChapterSelect,
                                                            }) => {
    const [openChapter, setOpenChapter] = useState<string | undefined>()

    const sortedChapters = useMemo(
        () => [...chapters].sort((a, b) => a.order - b.order),
        [chapters]
    )

    const handleChapterHover = async (chapterId: number) => {
        const chapter = chapters.find(ch => ch.id === chapterId)
        if (chapter && chapter.subchapters.length === 0) {
            handleChapterSelect?.(chapterId)
        }
    }

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openChapter}
            onValueChange={(value) => {
                setOpenChapter(value)
                const chapterId = value ? parseInt(value.replace('chapter-', '')) : null
                if (chapterId) {
                    handleChapterSelect?.(chapterId)
                }
            }}
        >
            {sortedChapters.map((chapter) => (
                <AccordionItem
                    key={chapter.id}
                    value={`chapter-${chapter.id}`}
                    onMouseEnter={() => handleChapterHover(chapter.id)}
                >
                    <AccordionTrigger>
                        <Chapter
                            order={chapter.order}
                            name={chapter.name}
                            review={chapter.review}
                            reviewNumber={chapter.reviewNumber}
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <SubChapterList
                            handleSubchapterSelect={handleSubchapterSelect}
                            subchapters={chapter.subchapters.sort((a, b) => a.order - b.order)}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}