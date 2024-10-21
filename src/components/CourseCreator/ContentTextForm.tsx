import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {CourseForm} from "@/components/CourseCreator/formSchema";

interface ContentTextFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    removeContent: (index: number) => void;
}

export const ContentTextForm: React.FC<ContentTextFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    removeContent
                                                                }) => {
    return (<FormField
        control={form.control}
        name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.text`}
        render={({field}) => (
            <FormItem>
                <FormControl>
                    <div className={"flex justify-between"}>
                        <Textarea
                            {...field}
                            placeholder="Text Content"
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                        />
                        <DeleteButton
                            onClick={() =>
                                removeContent(contentIndex)
                            }
                        />
                    </div>
                </FormControl>
                <FormMessage/>
            </FormItem>
        )}
    />)
}