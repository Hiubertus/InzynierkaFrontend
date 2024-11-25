import { ChapterAccordion } from "@/components/Course/ChapterAccordion"
import { CourseData, cQuiz, cText, cMedia, SubChapterData } from "@/models/front_models/CourseData"
import {useCallback, useEffect, useState} from "react"
import { QuizContent } from "@/components/Course/QuizContent"
import { TextContent } from "@/components/Course/TextConent"
import { MediaContent } from "@/components/Course/MediaContent"
import { ChapterAccordionSkeleton } from "@/components/Course/ChapterAccordionSkeleton"
import { CourseContentSkeleton} from "@/components/Course/CourseContentSkeleton";
import useCourseStore from "@/lib/stores/courseStore"

type ContentType = cText | cMedia | cQuiz

export const Course = ({course, isLoading}: {course: CourseData, isLoading: boolean}) => {
    const { fetchSubchaptersForChapter, fetchContentForSubchapter } = useCourseStore()
    const [isLoadingSubchapters, setIsLoadingSubchapters] = useState(false)
    const [isLoadingContent, setIsLoadingContent] = useState(false)
    const [selectedSubChapter, setSelectedSubChapter] = useState<SubChapterData | null>(null)

    const ContentRenderer = ({content}: {content: ContentType}) => {
        switch (content.type) {
            case 'text':
                return <TextContent content={content}/>
            case 'image':
            case 'video':
                return <MediaContent content={content}/>
            case 'quiz':
                return <QuizContent content={content}/>
            default:
                return null
        }
    }

    const handleSubChapterSelect = useCallback(async (subChapter: SubChapterData) => {
        setIsLoadingContent(true)
        if (!subChapter.content) {
            await fetchContentForSubchapter(subChapter.id)
        }
        setSelectedSubChapter(subChapter)
        setIsLoadingContent(false)
    }, [fetchContentForSubchapter])
    
    useEffect(() => {
        const initializeFirstSubchapter = async () => {
            if (!isLoading && course.chapters.length > 0) {
                const firstChapter = course.chapters.find(chapter => chapter.order === 1)
                if (firstChapter && firstChapter.subchapters.length === 0) {
                    setIsLoadingSubchapters(true)
                    await fetchSubchaptersForChapter(firstChapter.id)
                    setIsLoadingSubchapters(false)

                    const updatedChapter = course.chapters.find(ch => ch.id === firstChapter.id)
                    const firstSubchapter = updatedChapter?.subchapters.find(sub => sub.order === 1)
                    if (firstSubchapter) {
                        await handleSubChapterSelect(firstSubchapter)
                    }
                }
            }
        }

        initializeFirstSubchapter()
    }, [course.chapters, fetchSubchaptersForChapter, handleSubChapterSelect, isLoading])
    
    const handleChapterSelect = async (chapterId: number) => {
        if (course.chapters.find(ch => ch.id === chapterId)?.subchapters.length === 0) {
            setIsLoadingSubchapters(true)
            await fetchSubchaptersForChapter(chapterId)
            setIsLoadingSubchapters(false)
        }
    }

    return (
        <div className="flex w-full h-screen">
            <div className="flex-grow p-6 overflow-y-auto">
                {isLoadingContent ? (
                    <CourseContentSkeleton />
                ) : (
                    <div className="flex flex-col gap-6">
                        {selectedSubChapter?.content?.map(content => (
                            <ContentRenderer key={content.id} content={content}/>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex-none w-1/4 max-w-[30%] min-w-[20%] overflow-y-auto border-r border-gray-300 p-4 bg-gray-100">
                {isLoading || isLoadingSubchapters ? (
                    <ChapterAccordionSkeleton />
                ) : (
                    <ChapterAccordion
                        chapters={course.chapters}
                        handleSubchapterSelect={handleSubChapterSelect}
                        handleChapterSelect={handleChapterSelect}
                    />
                )}
            </div>
        </div>
    )
}