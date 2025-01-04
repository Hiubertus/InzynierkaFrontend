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
    courseId?: number;
}

export const ContentCreator: FC<ContentCreator> = ({
                                                       content,
                                                       form,
                                                       chapterIndex,
                                                       subChapterIndex,
                                                       contentIndex,
                                                       removeContent,
                                                       swap,
                                                       contentsLength,
                                                       courseId,
                                                   }) => {
    const handleRemoveContent = () => {
        if (!courseId || content.id === null) {
            removeContent(contentIndex);
        } else {

            form.setValue(
                `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.deleted`,
                true
            );
        }
    };

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
                        removeContent={handleRemoveContent}
                    />
                )}
                {(content.type === 'video' || content.type === 'image') && (
                    <ContentFileForm
                        form={form}
                        contentType={content.type}
                        chapterIndex={chapterIndex}
                        subChapterIndex={subChapterIndex}
                        contentIndex={contentIndex}
                        removeContent={handleRemoveContent}
                    />
                )}
                {content.type === 'quiz' && (
                    <ContentQuizForm
                        form={form}
                        chapterIndex={chapterIndex}
                        subChapterIndex={subChapterIndex}
                        contentIndex={contentIndex}
                        removeContent={handleRemoveContent}
                        courseId={courseId}
                    />
                )}
            </div>
        </div>
    );
}