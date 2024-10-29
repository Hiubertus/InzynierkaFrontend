import {ContentTextForm} from "@/components/CourseCreator/ContentTextForm";
import {ContentFileForm} from "@/components/CourseCreator/ContentFileForm";
import {ContentQuizForm} from "@/components/CourseCreator/ContentQuizForm";
import {FC} from "react";
import { CourseForm } from "./formSchema";
import {FieldArrayWithId, UseFormReturn} from "react-hook-form";

interface ContentCreator {
    content:  FieldArrayWithId<CourseForm, `chapters.${number}.subchapters.${number}.content`, "id">;
    removeContent: (index: number) => void;
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
}

export const ContentCreator: FC<ContentCreator> = ({content,form, chapterIndex, subChapterIndex, contentIndex,removeContent}) => {

    return (
        <div
             className="flex flex-col rounded-lg overflow-hidden py-4">
            <div className="w-full">
                {content.type === 'text' && (
                    <ContentTextForm
                        form={form}
                        chapterIndex={chapterIndex}
                        subChapterIndex={subChapterIndex}
                        contentIndex={contentIndex}
                        removeContent={removeContent}
                    />
                )}
                {(content.type === 'video' || content.type === 'image') && (
                    <ContentFileForm
                        form={form}
                        contentType={content.type}
                        chapterIndex={chapterIndex}
                        subChapterIndex={subChapterIndex}
                        contentIndex={contentIndex}
                        removeContent={removeContent}
                    />
                )}
                {content.type === 'quiz' && (
                    <ContentQuizForm
                        form={form}
                        chapterIndex={chapterIndex}
                        subChapterIndex={subChapterIndex}
                        contentIndex={contentIndex}
                        removeContent={removeContent}
                    />
                )}

            </div>
        </div>)
}