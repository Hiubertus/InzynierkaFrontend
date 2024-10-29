import { ChapterAccordion } from "@/components/Course/ChapterAccordion";
import { CourseData, cQuiz, cText, cMedia, SubChapterData } from "@/models/CourseData";
import { useState } from "react";
import { QuizContent } from "@/components/Course/QuizContent";
import { TextContent } from "@/components/Course/TextConent";
import { MediaContent } from "@/components/Course/MediaContent";

type ContentType = cText | cMedia | cQuiz;

export const Course = ({course}: {course: CourseData}) => {
    const ContentRenderer = ({content}: {content: ContentType}) => {
        switch (content.type) {
            case 'text':
                return <TextContent content={content}/>;
            case 'image':
            case 'video':
                return <MediaContent content={content}/>;
            case 'quiz':
                return <QuizContent content={content}/>;
            default:
                return null;
        }
    };

    const [selectedSubChapter, setSelectedSubChapter] = useState<SubChapterData | null>(
        () => {
            const chapterWithOrderOne = course.chapters.find(chapter => chapter.order === 1);
            const subChapterWithOrderOne = chapterWithOrderOne?.subchapters.find(
                subchapter => subchapter.order === 1
            );
            return subChapterWithOrderOne ?? null;
        }
    );

    const handleSubChapterSelect = (subChapter: SubChapterData) => {
        setSelectedSubChapter(subChapter);
    };

    const handleCompletionChange = (subChapterId: number, completed: boolean) => {
        console.log("test");
    };

    return (
        <div className="flex w-full h-screen">
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex flex-col gap-6">
                    {selectedSubChapter?.content.map(content => (
                        <ContentRenderer key={content.id} content={content}/>
                    ))}
                </div>
            </div>
            <div className="flex-none w-1/4 max-w-[30%] min-w-[20%] overflow-y-auto border-r border-gray-300 p-4 bg-gray-100">
                <ChapterAccordion
                    handleCompletionChange={handleCompletionChange}
                    chapters={course.chapters}
                    handleSubchapterSelect={handleSubChapterSelect}
                />
            </div>
        </div>
    );
};