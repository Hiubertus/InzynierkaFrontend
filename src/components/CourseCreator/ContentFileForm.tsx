import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {FileUpload} from "@/components/CourseCreator/FileUpload";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {CourseForm} from "@/components/CourseCreator/formSchema";

interface ContentFileFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    contentType: 'video' | "image";
    removeContent: (index: number) => void;
}

export const ContentFileForm: React.FC<ContentFileFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    contentType,
                                                                    removeContent
                                                                }) => {
    return (<div className={"w-full"}>
        <FormField
            control={form.control}
            name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.${contentType}`}
            render={({field}) => (
                <FormItem>
                    <FormControl>
                        <div className={"flex justify-between"}>
                            <FileUpload
                                onFileUploaded={(file) => {
                                    field.onChange(file);
                                }}
                                accept={contentType === 'video' ? {'video/*': []} : {'image/*': []}}
                                maxSize={50 * 1024 * 1024}
                                removeContent={() =>
                                    removeContent(contentIndex)
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