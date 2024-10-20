import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {FileUpload} from "@/components/CourseCreator/FileUpload";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {ChapterData, cImage, CourseData, cVideo, SubChapterData} from "@/models/CourseData";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";

interface ContentFileFormProps {
    form: UseFormReturn<CourseData>;
    contentItem: cImage | cVideo;
    chapter: ChapterData;
    subchapter: SubChapterData;
    chapterIndex: number;
    subchapterIndex: number;
    contentIndex: number;
    updateVideoContent: (chapterId: number, subChapterId: number, contentId: number, file: File) => void;
    updateImageContent: (chapterId: number, subChapterId: number, contentId: number, file: File) => void;
    removeContentFromSubChapter: (chapterId: number, subChapterId: number, contentId: number) => void;
}

export const ContentFileForm: React.FC<ContentFileFormProps> = ({
                                                                    form,
                                                                    contentItem,
                                                                    chapter,
                                                                    subchapter,
                                                                    chapterIndex,
                                                                    subchapterIndex,
                                                                    contentIndex,
                                                                    updateImageContent,
                                                                    updateVideoContent,
                                                                    removeContentFromSubChapter
                                                                }) => {
    return (<div className={"w-full"}>
        <FormField
            key={contentItem.id}
            control={form.control}
            name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.${contentItem.type}`}
            render={({field}) => (
                <FormItem>
                    <FormControl>
                        <div className={"flex justify-between"}>
                            <FileUpload
                                onFileUploaded={(file) => {
                                    if (contentItem.type === 'video') {
                                        updateVideoContent(chapter.id, subchapter.id, contentItem.id, file);
                                    } else {
                                        updateImageContent(chapter.id, subchapter.id, contentItem.id, file);
                                    }
                                    field.onChange(file);
                                }}
                                accept={contentItem.type === 'video' ? {'video/*': []} : {'image/*': []}}
                                maxSize={50 * 1024 * 1024}
                            />
                            <DeleteButton
                                onClick={() =>
                                    removeContentFromSubChapter(chapter.id, subchapter.id, contentItem.id)
                                }
                            />
                        </div>

                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    </div>)
}