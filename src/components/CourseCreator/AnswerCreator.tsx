import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";

interface AnswerCreatorProps {
    form: UseFormReturn<CourseForm>;
    answersLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    questionIndex: number;
    answerIndex: number;
    removeAnswer: (index: number) => void;
}

export const AnswerCreator: React.FC<AnswerCreatorProps> = ({
                                                                form,
                                                                answersLength,
                                                                chapterIndex,
                                                                subChapterIndex,
                                                                contentIndex,
                                                                questionIndex,
                                                                answerIndex,
                                                                removeAnswer
                                                            }) => {
    return (
        <div className="flex flex-col py-4 rounded-lg overflow-hidden">

                <FormField
                    control={form.control}
                    name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.answer`}
                    render={({field}) => (
                        <FormItem className="flex-grow mr-2">
                            <FormControl>
                                <div className={"w-full flex justify-between"}>
                                    <div className={"flex items-center"}>
                                        <FormField
                                            control={form.control}
                                            name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.isCorrect`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                            }}
                                                            className="mr-2"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Input
                                        {...field}
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                    <DeleteButton
                                        onClick={() => {
                                            removeAnswer(answerIndex);
                                        }}
                                        disabled={answersLength <= 2}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
        </div>)
}