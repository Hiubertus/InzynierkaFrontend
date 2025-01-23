import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/CourseCreator/FileUpload";
import { UseFormReturn } from "react-hook-form";
import { CourseForm } from "@/components/CourseCreator/formSchema";
import {FC} from "react";

interface ContentFileFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    contentType: 'video' | "image";
    removeContent: (index: number) => void;
}

export const ContentFileForm: FC<ContentFileFormProps> = ({
                                                              form,
                                                              chapterIndex,
                                                              subChapterIndex,
                                                              contentIndex,
                                                              contentType,
                                                              removeContent,
                                                          }) => {
    const currentFile = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.file`);

    return (
        <FormField
            control={form.control}
            name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.file`}
            render={({field}) => (
                <FormItem>
                    <FormControl>
                        <FileUpload
                            onFileUploaded={(file) => {
                                console.log('File being uploaded:', file);
                                field.onChange(file);
                                form.setValue(
                                    `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.updateFile`,
                                    true
                                );

                            }}
                            currentFile={currentFile}
                            accept={contentType === 'video' ? {'video/*': []} : {'image/*': []}}
                            maxSize={50 * 1024 * 1024}
                            removeContent={() => removeContent(contentIndex)}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};