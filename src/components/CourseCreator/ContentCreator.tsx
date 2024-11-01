import {ContentTextForm} from "@/components/CourseCreator/ContentTextForm";
import {ContentFileForm} from "@/components/CourseCreator/ContentFileForm";
import {ContentQuizForm} from "@/components/CourseCreator/ContentQuizForm";
import {FC} from "react";
import { CourseForm } from "./formSchema";
import {FieldArrayWithId, UseFormReturn} from "react-hook-form";
import OrderButtons from "@/components/CourseCreator/OrderButtons";

interface ContentCreator {
    content: FieldArrayWithId<CourseForm, `chapters.${number}.subchapters.${number}.content`, "id">;
    removeContent: (index: number) => void;
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    swap: (from: number, to: number) => void;
    contentsLength: number;
}

export const ContentCreator: FC<ContentCreator> = ({
                                                       content,
                                                       form,
                                                       chapterIndex,
                                                       subChapterIndex,
                                                       contentIndex,
                                                       removeContent,
                                                       swap,
                                                       contentsLength
                                                   }) => {
    return (
        <div className="flex rounded-lg overflow-hidden py-4">
            <OrderButtons
                onMoveUp={() => swap(contentIndex, contentIndex - 1)}
                onMoveDown={() => swap(contentIndex, contentIndex + 1)}
                canMoveUp={contentIndex > 0}
                canMoveDown={contentIndex < contentsLength - 1}
            />
            <div className="flex-1">
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
        </div>
    );
}