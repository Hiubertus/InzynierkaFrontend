import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React, { useEffect } from "react";
import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {AnswerCreator} from "@/components/CourseCreator/AnswerCreator";
import OrderButtons from "@/components/CourseCreator/OrderButtons";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";

interface QuizCreatorProps {
    form: UseFormReturn<CourseForm>;
    questionsLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    questionIndex: number;
    removeQuestion: (index: number) => void;
    swap: (from: number, to: number) => void;
}

export const QuestionCreator: React.FC<QuizCreatorProps> = ({
                                                                form,
                                                                chapterIndex,
                                                                subChapterIndex,
                                                                contentIndex,
                                                                questionIndex,
                                                                removeQuestion,
                                                                questionsLength,
                                                                swap
                                                            }) => {
    const {
        fields: answers,
        append: appendAnswer,
        remove: removeAnswer,
        swap: swapAnswer,
        move: moveAnswer
    } = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers`
    });

    const singleAnswer = form.watch(
        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.singleAnswer` as const
    );

    // Watch for any changes in answers' isCorrect values
    const answersValues = form.watch(
        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const
    );

    // Sprawdź, czy którakolwiek odpowiedź jest zaznaczona
    const hasAnyCorrectAnswer = answersValues?.some(answer => answer.isCorrect);

    // Resetuj wszystkie odpowiedzi przy zmianie typu pytania
    useEffect(() => {
        const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;
        const currentAnswers = form.getValues(answersFieldName);

        if (currentAnswers) {
            currentAnswers.forEach((_, index) => {
                form.setValue(
                    `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${index}.isCorrect` as const,
                    false
                );
            });
        }
    }, [singleAnswer, chapterIndex, subChapterIndex, contentIndex, questionIndex, form]);

    // Efekt dla walidacji
    useEffect(() => {
        const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;

        // Jeśli jest poprawna odpowiedź, wyczyść błąd
        if (hasAnyCorrectAnswer) {
            form.clearErrors(answersFieldName);
        } else {
            // Ustaw błąd tylko jeśli formularz był już submitowany
            if (form.formState.isSubmitted) {
                form.setError(answersFieldName, {
                    type: 'custom',
                    message: 'You must select at least one correct answer!'
                });
            }
        }
    }, [hasAnyCorrectAnswer, form, chapterIndex, subChapterIndex, contentIndex, questionIndex]);


    return (
        <Card className="border-l-2 border-l-purple-300">
            <CardHeader className="flex flex-col rounded-lg bg-purple-50 overflow-hidden">
                <div className="flex w-full">
                    <OrderButtons
                        onMoveUp={() => swap(questionIndex, questionIndex - 1)}
                        onMoveDown={() => swap(questionIndex, questionIndex + 1)}
                        canMoveUp={questionIndex > 0}
                        canMoveDown={questionIndex < questionsLength - 1}
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.singleAnswer`}
                                render={({field}) => (
                                    <FormItem className="flex items-center gap-2">
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    checked={field.value}
                                                    onChange={() => field.onChange(true)}
                                                />
                                                Single Choice
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    checked={!field.value}
                                                    onChange={() => field.onChange(false)}
                                                />
                                                Multiple Choice
                                            </label>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.question`}
                            render={({field}) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <div className="w-full flex justify-between">
                                            <Input
                                                {...field}
                                                placeholder={`Question ${questionIndex + 1}`}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                            <DeleteButton
                                                onClick={() => {
                                                    removeQuestion(questionIndex);
                                                }}
                                                disabled={questionsLength <= 1}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="bg-purple-100">
                <DraggableList
                    items={answers}
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) => item.id !== answers[index]?.id)?.id;
                        if (movedItemId) {
                            const oldIndex = answers.findIndex(item => item.id === movedItemId);
                            const newIndex = newOrder.findIndex(item => item.id === movedItemId);

                            moveAnswer(oldIndex, newIndex);
                        }
                    }}
                    getId={(item) => item.id}
                    renderItem={(answer, index) => (
                        <AnswerCreator
                            key={answer.id}
                            form={form}
                            answersLength={answers.length}
                            chapterIndex={chapterIndex}
                            subChapterIndex={subChapterIndex}
                            contentIndex={contentIndex}
                            questionIndex={questionIndex}
                            answerIndex={index}
                            removeAnswer={removeAnswer}
                            singleAnswer={singleAnswer}
                            swap={swapAnswer}
                        />
                    )}
                    className="space-y-4"
                    itemClassName="hover:shadow-md"
                    activationDelay={250}
                />

                <div className="mt-2 space-y-2">
                    <Button
                        onClick={() => {
                            if (answers.length >= 8) {
                                const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;
                                form.setError(answersFieldName, {
                                    type: 'manual',
                                    message: 'Maximum 8 answers are allowed'
                                });
                                return;
                            }
                            appendAnswer({
                                isCorrect: false,
                                answer: `Answer ${answers.length + 1}`
                            });
                        }}
                        type="button"
                        disabled={answers.length >= 8}
                    >
                        <Plus size={16} className="mr-1"/>
                        Add Answer
                    </Button>

                    {/* Error message container */}
                    <FormField
                        control={form.control}
                        name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const}
                        render={({fieldState}) => (
                            <div className="text-sm font-medium text-destructive">
                                {fieldState.error?.message}
                            </div>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};