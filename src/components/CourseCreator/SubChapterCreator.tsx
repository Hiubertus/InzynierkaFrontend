import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {ContentButtons} from "@/components/CourseCreator/ContentButtons";
import React from "react";
import {FieldArrayWithId, useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {ContentCreator} from "@/components/CourseCreator/ContentCreator";

interface SubChapterCreatorProps {
    subChapter: FieldArrayWithId<CourseForm, `chapters.${number}.subchapters`, "id">;
    subChaptersLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    removeSubChapter: (index: number) => void;
    form: UseFormReturn<CourseForm>;
}

export const SubChapterCreator: React.FC<SubChapterCreatorProps> = ({
                                                                        subChapter,
                                                                        chapterIndex,
                                                                        subChapterIndex,
                                                                        subChaptersLength,
                                                                        removeSubChapter,
                                                                        form
                                                                    }) => {

    const {fields: contents, append: appendContent, remove: removeContent} = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content`
    });

    return (
        <Card className="border-l-2 border-l-indigo-300">
            <CardHeader className="flex flex-col bg-indigo-100 overflow-hidden">
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.name`}
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <div className={"w-full flex justify-between"}>
                                        <Input
                                            {...field}
                                            placeholder={`Subchapter ${subChapterIndex + 1} Name`}
                                            value={subChapter.name}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        />
                                        <DeleteButton
                                            onClick={() => {
                                                if (subChaptersLength > 1) {
                                                    removeSubChapter(subChapterIndex);
                                                }
                                            }}
                                            disabled={subChaptersLength <= 1}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent className="bg-indigo-50">
                {contents.map((content, contentIndex) => (
                    <ContentCreator key={content.id} content={content} form={form} chapterIndex={chapterIndex}
                                    subChapterIndex={subChapterIndex} contentIndex={contentIndex}
                                    removeContent={removeContent}/>
                ))}
                <ContentButtons
                    appendContent={appendContent}
                />
            </CardContent>
        </Card>)
}