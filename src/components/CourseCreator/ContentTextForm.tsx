import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import React from "react";
import {ChapterData, CourseData, cText, SubChapterData} from "@/models/CourseData";
import {UseFormReturn} from "react-hook-form";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";

interface ContentTextFormProps {
    form: UseFormReturn<CourseData>;
    contentItem: cText;
    chapter: ChapterData;
    subchapter: SubChapterData;
    chapterIndex: number;
    subchapterIndex: number;
    contentIndex: number;
    updateTextContent: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        text: string,
        fontSize?: "small" | "medium" | "large",
        fontWeight?: "normal" | "bold" | "bolder",
        italics?: boolean,
        emphasis?: boolean
    ) => void;
    removeContentFromSubChapter: (chapterId: number, subChapterId: number, contentId: number) => void;
}

export const ContentTextForm: React.FC<ContentTextFormProps> = ({
                                                                    form,
                                                                    chapter,
                                                                    subchapter,
                                                                    contentItem,
                                                                    chapterIndex,
                                                                    subchapterIndex,
                                                                    contentIndex,
                                                                    updateTextContent,
                                                                    removeContentFromSubChapter
                                                                }) => {
    return (<FormField
        key={contentItem.id}
        control={form.control}
        name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.text`}
        render={({field}) => (
            <FormItem>
                <FormControl>
                    <div className={"flex justify-between"}>
                        <Textarea
                            {...field}
                            placeholder="Text Content"
                            onChange={(e) => {
                                updateTextContent(chapter.id, subchapter.id, contentItem.id, e.target.value);
                                field.onChange(e);
                            }}
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
    />)
}