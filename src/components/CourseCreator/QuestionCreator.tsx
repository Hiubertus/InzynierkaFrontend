import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";
import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {AnswerCreator} from "@/components/CourseCreator/AnswerCreator";

interface QuizCreatorProps {
    form: UseFormReturn<CourseForm>;
    questionsLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    questionIndex: number;
    removeQuestion: (index: number) => void;
}

export const QuestionCreator: React.FC<QuizCreatorProps> = ({
                                                                form,
                                                                chapterIndex,
                                                                subChapterIndex,
                                                                contentIndex,
                                                                questionIndex,
                                                                removeQuestion,
                                                                questionsLength
                                                            }) => {

    const {fields: answers, append: appendAnswer, remove: removeAnswer} = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers`
    });

    return (
        <Card
            className="border-l-2 border-l-purple-300">
            <CardHeader className="flex flex-col rounded-lg bg-purple-50 overflow-hidden">
                    <FormField
                        control={form.control}
                        name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.question`}
                        render={({field}) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <div className={"w-full flex justify-between"}>
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
            </CardHeader>
            <CardContent className="bg-purple-100">
                {answers.map((answer, answerIndex) => (
                    <AnswerCreator key={answer.id} form={form} answersLength={answers.length}
                                   chapterIndex={chapterIndex} subChapterIndex={subChapterIndex}
                                   contentIndex={contentIndex} questionIndex={questionIndex} answerIndex={answerIndex}
                                   removeAnswer={removeAnswer}/>
                ))}
                <Button
                    onClick={() => {
                        appendAnswer({
                            isCorrect: false,
                            answer: `Answer ${answers.length + 1}`
                        });
                    }}
                    className="mt-2"
                    type={"button"}
                >
                    <Plus size={16} className="mr-1"/>
                    Add Answer
                </Button>
            </CardContent>
        </Card>)
}