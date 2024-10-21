import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {FieldArrayWithId, useFieldArray, UseFormReturn} from "react-hook-form";
import {SubChapterCreator} from "@/components/CourseCreator/SubChapterCreator";

interface ChapterCreatorProps {
    chapter: FieldArrayWithId<CourseForm, "chapters", "id">;
    chaptersLength: number;
    chapterIndex: number;
    removeChapter: (index: number) => void;
    form: UseFormReturn<CourseForm>;
}


export const ChapterCreator: React.FC<ChapterCreatorProps> = ({
                                                                  chapter,
                                                                  chapterIndex,
                                                                  chaptersLength,
                                                                  removeChapter,
                                                                  form
                                                              }) => {

    const {fields: subChapters, append: appendSubChapter, remove: removeSubChapter} = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters`
    });

    return (
        <Card className="mb-4 shadow-md border-l-4 border-l-blue-300">
            <CardHeader className="flex flex-col bg-blue-100 overflow-hidden">
                <div className={"w-full"}>
                    <FormField
                        control={form.control}
                        name={`chapters.${chapterIndex}.name`}
                        render={({field}) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <div className="flex justify-between">
                                        <Input
                                            {...field}
                                            placeholder={`Chapter ${chapterIndex + 1} Name`}
                                            value={chapter.name}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        />
                                        <DeleteButton
                                            onClick={() => {
                                                if (chaptersLength > 1) {
                                                    removeChapter(chapterIndex);
                                                }
                                            }}
                                            disabled={chaptersLength <= 1}
                                        />
                                    </div>

                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4 bg-indigo-200">
                {subChapters.map((subChapter, subChapterIndex) => (
                    <SubChapterCreator key={subChapter.id} subChapter={subChapter} subChaptersLength={subChapters.length}
                                       chapterIndex={chapterIndex} subChapterIndex={subChapterIndex}
                                       removeSubChapter={removeSubChapter} form={form}/>
                ))}
                <Button
                    onClick={() => appendSubChapter({
                        name: `SubChapter ${subChapters.length + 1}`,
                        content: []
                    })}
                    variant="outline"
                    className="w-full mt-4 flex items-center justify-center"
                    type="button"
                >
                    <Plus size={16} className="mr-1"/>
                    Add Subchapter
                </Button>
            </CardContent>
        </Card>
    )

}