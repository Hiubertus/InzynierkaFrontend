import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {FC, useEffect} from "react";
import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {AnswerCreator} from "@/components/CourseCreator/AnswerCreator";
import OrderButtons from "@/components/CourseCreator/OrderButtons";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";
import {useRealIndex} from "@/components/CourseCreator/useRealIndex";

interface QuizCreatorProps {
    form: UseFormReturn<CourseForm>;
    questionsLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    questionIndex: number;
    removeQuestion: (index: number) => void;
    swap: (from: number, to: number) => void;
    courseId?: number
}

export const QuestionCreator: FC<QuizCreatorProps> = ({
                                                                form,
                                                                chapterIndex,
                                                                subChapterIndex,
                                                                contentIndex,
                                                                questionIndex,
                                                                removeQuestion,
                                                                questionsLength,
                                                                swap,
                                                                courseId,
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

    const answersValues = form.watch(
        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const
    );



    useEffect(() => {
        if (singleAnswer) {
            const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;
            const currentAnswers = form.getValues(answersFieldName);

            const correctAnswers = currentAnswers.filter(answer => answer.isCorrect);
            if (correctAnswers.length > 1) {
                const firstCorrectIndex = currentAnswers.findIndex(answer => answer.isCorrect);
                currentAnswers.forEach((_, index) => {
                    if (index !== firstCorrectIndex) {
                        form.setValue(
                            `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${index}.isCorrect` as const,
                            false
                        );
                    }
                });
            }
        }
    });
    const visibleAnswers = () => {
        return answers.filter((_, index) => {
            const watchedAnswer = answersValues[index];
            return !courseId || !watchedAnswer.deleted;
        });
    };

    const hasAnyCorrectAnswer = visibleAnswers()?.some(answer => answer.isCorrect);
    // Efekt dla walidacji
    useEffect(() => {
        const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;

        if (hasAnyCorrectAnswer) {
            form.clearErrors(answersFieldName);
        } else {
            if (form.formState.isSubmitted) {
                form.setError(answersFieldName, {
                    type: 'custom',
                    message: 'You must select at least one correct answer!'
                });
            }
        }
    }, [hasAnyCorrectAnswer, form, chapterIndex, subChapterIndex, contentIndex, questionIndex]);

    const calculateRealIndex = useRealIndex(answersValues);

    const handleRemoveAnswer = (visibleIndex: number) => {
        const answer = visibleAnswers()[visibleIndex];
        if (!courseId || isNaN(Number(answer.id))) {
            removeAnswer(visibleIndex);
        } else {
            const realIndex = calculateRealIndex(visibleIndex);
            form.setValue(
                `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${realIndex}.deleted`,
                true
            );
        }
    };

    const handleAppendAnswer = () => {
        if (answers.length >= 8) {
            const answersFieldName = `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers` as const;
            form.setError(answersFieldName, {
                type: 'manual',
                message: 'Maximum 8 answers are allowed'
            });
            return;
        }

        if (!courseId) {
            appendAnswer({
                isCorrect: false,
                answer: `Answer ${answers.length + 1}`
            });
        } else {
            appendAnswer({
                id: null,
                isCorrect: false,
                answer: `Answer ${answers.length + 1}`,
                deleted: false
            });
        }
    };


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
                    items={visibleAnswers()}
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) =>
                            item.id !== visibleAnswers()[index].id);
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
                            answersLength={visibleAnswers().length}
                            chapterIndex={chapterIndex}
                            subChapterIndex={subChapterIndex}
                            contentIndex={contentIndex}
                            questionIndex={questionIndex}
                            answerIndex={index}
                            removeAnswer={handleRemoveAnswer}
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
                        onClick={handleAppendAnswer}
                        type="button"
                        disabled={visibleAnswers().length >= 8}
                    >
                        <Plus size={16} className="mr-1"/>
                        Add Answer
                    </Button>

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