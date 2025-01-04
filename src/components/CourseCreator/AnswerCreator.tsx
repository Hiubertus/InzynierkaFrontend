import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import OrderButtons from "@/components/CourseCreator/OrderButtons";

interface AnswerCreatorProps {
    form: UseFormReturn<CourseForm>;
    answersLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    questionIndex: number;
    answerIndex: number;
    removeAnswer: (index: number) => void;
    singleAnswer: boolean;
    swap: (from: number, to: number) => void;
}

export const AnswerCreator: React.FC<AnswerCreatorProps> = ({
                                                                form,
                                                                answersLength,
                                                                chapterIndex,
                                                                subChapterIndex,
                                                                contentIndex,
                                                                questionIndex,
                                                                answerIndex,
                                                                removeAnswer,
                                                                singleAnswer,
                                                                swap
                                                            }) => {

    const handleSingleAnswerChange = (checked: boolean) => {
        if (checked && singleAnswer) {
            const currentAnswers = form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers`);
            console.log("siurek")
            currentAnswers.forEach((_, index) => {
                console.log("kanalia")
                if (index !== answerIndex) {
                    form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${index}.isCorrect`, false);
                }
            });
        }
    };

    const inputName = `question-${chapterIndex}-${subChapterIndex}-${contentIndex}-${questionIndex}-answers`;
    const isCorrect = form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.isCorrect`)
    console.log(isCorrect)


    return (
        <div className="flex py-4 rounded-lg overflow-hidden">
            <OrderButtons
                onMoveUp={() => swap(answerIndex, answerIndex - 1)}
                onMoveDown={() => swap(answerIndex, answerIndex + 1)}
                canMoveUp={answerIndex > 0}
                canMoveDown={answerIndex < answersLength - 1}
            />
            <FormField
                control={form.control}
                name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.answer`}
                render={({field}) => (
                    <FormItem className="flex-grow mr-2">
                        <FormControl>
                            <div className="w-full flex justify-between">
                                <div className="flex items-center">
                                    <FormField
                                        control={form.control}
                                        name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.isCorrect`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input
                                                        type={singleAnswer ? "radio" : "checkbox"}
                                                        checked={field.value}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.checked);
                                                            handleSingleAnswerChange(e.target.checked);
                                                            console.log("kupaaa")
                                                        }}
                                                        className="mr-2"
                                                        name={inputName}
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
        </div>
    );
};