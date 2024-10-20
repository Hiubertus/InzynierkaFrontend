import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {ChapterData, CourseData, cQuiz, SubChapterData} from "@/models/CourseData";

interface ContentQuizFormProps {
    form: UseFormReturn<CourseData>;
    contentItem: cQuiz;
    chapter: ChapterData;
    subchapter: SubChapterData;
    chapterIndex: number;
    subchapterIndex: number;
    contentIndex: number;
    addQuizQuestion: (chapterId: number, subChapterId: number, contentId: number) => void;
    removeQuizQuestion: (chapterId: number, subChapterId: number, contentId: number, questionId: number) => void;
    updateQuizQuestion: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number,
        question: string
    ) => void;
    addQuizAnswer: (chapterId: number, subChapterId: number, contentId: number, questionId: number) => void;
    removeQuizAnswer: (chapterId: number, subChapterId: number, contentId: number, questionId: number, answerId: number) => void;
    updateQuizAnswer: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number,
        answerId: number,
        answer: string,
        isCorrect: boolean
    ) => void;
    removeContentFromSubChapter: (chapterId: number, subChapterId: number, contentId: number) => void;
}

export const ContentQuizForm: React.FC<ContentQuizFormProps> = ({
                                                                    form,
                                                                    contentItem,
                                                                    chapter,
                                                                    subchapter,
                                                                    chapterIndex,
                                                                    subchapterIndex,
                                                                    contentIndex,
                                                                    addQuizAnswer,
                                                                    addQuizQuestion,
                                                                    removeQuizQuestion,
                                                                    removeQuizAnswer,
                                                                    updateQuizQuestion,
                                                                    updateQuizAnswer,
                                                                    removeContentFromSubChapter
                                                                }) => {
    return (
        <div className={"flex justify-between"}>
            <div key={contentItem.id}
                 className="space-y-4 p-4 w-full bg-indigo-50 border border-gray-200 border-l-2 border-l-indigo-300">
                {contentItem.quizContent.map((question, questionIndex) => (
                    <Card key={question.id}
                          className="border-l-2 border-l-purple-300">
                        <CardHeader className="flex flex-col rounded-lg bg-purple-50 overflow-hidden">
                            <div className="flex justify-between">
                                <FormField
                                    control={form.control}
                                    name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.question`}
                                    render={({field}) => (
                                        <FormItem className="flex-grow">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={`Question ${questionIndex + 1}`}
                                                    onChange={(e) => {
                                                        updateQuizQuestion(chapter.id, subchapter.id, contentItem.id, question.id, e.target.value);
                                                        field.onChange(e);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <DeleteButton
                                    onClick={() => {
                                        removeQuizQuestion(chapter.id, subchapter.id, contentItem.id, question.id);
                                        // const chapters = form.getValues('chapters');
                                        // const content = chapters[chapterIndex].subchapters[subchapterIndex].content[contentIndex];
                                        // if (content.type === 'quiz') {
                                        //     content.quizContent.splice(questionIndex, 1);
                                        //     form.setValue('chapters', chapters);
                                        // }
                                    }}
                                    disabled={contentItem.quizContent.length <= 1}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="bg-purple-100">
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answer.id} className="flex flex-col py-4 rounded-lg overflow-hidden">
                                    <div className="flex justify-between">
                                        <FormField
                                            control={form.control}
                                            name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.answer`}
                                            render={({field}) => (
                                                <FormItem className="flex-grow mr-2">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder={`Answer ${answerIndex + 1}`}
                                                            onChange={(e) => {
                                                                const currentAnswer = form.getValues(`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}`);
                                                                updateQuizAnswer(
                                                                    chapter.id,
                                                                    subchapter.id,
                                                                    contentItem.id,
                                                                    question.id,
                                                                    answer.id,
                                                                    e.target.value,
                                                                    currentAnswer.isCorrect
                                                                );
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}.isCorrect`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => {
                                                                const currentAnswer = form.getValues(`chapters.${chapterIndex}.subchapters.${subchapterIndex}.content.${contentIndex}.quizContent.${questionIndex}.answers.${answerIndex}`);
                                                                updateQuizAnswer(
                                                                    chapter.id,
                                                                    subchapter.id,
                                                                    contentItem.id,
                                                                    question.id,
                                                                    answer.id,
                                                                    currentAnswer.answer,
                                                                    e.target.checked
                                                                );
                                                                field.onChange(e);
                                                            }}
                                                            className="mr-2"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <DeleteButton
                                            onClick={() => {
                                                removeQuizAnswer(chapter.id, subchapter.id, contentItem.id, question.id, answer.id);
                                                // const chapters = form.getValues('chapters');
                                                // const content = chapters[chapterIndex].subchapters[subchapterIndex].content[contentIndex];
                                                // if (content.type === 'quiz') {
                                                //     content.quizContent[questionIndex].answers.splice(answerIndex, 1);
                                                //     form.setValue('chapters', chapters);
                                                // }
                                            }}
                                            disabled={question.answers.length <= 2}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button
                                onClick={() => {
                                    addQuizAnswer(chapter.id, subchapter.id, contentItem.id, question.id);
                                    // const chapters = form.getValues('chapters');
                                    // const content = chapters[chapterIndex].subchapters[subchapterIndex].content[contentIndex];
                                    // if (content.type === 'quiz') {
                                    //     const answerCount = content.quizContent[questionIndex].answers.length + 1;
                                    //     content.quizContent[questionIndex].answers.push({
                                    //         id: answerCount,
                                    //         order: answerCount,
                                    //         answer: `Answer ${answerCount}`,
                                    //         isCorrect: false
                                    //     });
                                    //     form.setValue('chapters', chapters);
                                    // }
                                }}
                                className="mt-2"
                                type={"button"}
                            >
                                <Plus size={16} className="mr-1"/>
                                Add Answer
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                <Button
                    onClick={() => {
                        addQuizQuestion(chapter.id, subchapter.id, contentItem.id);
                        const chapters = form.getValues('chapters');
                        const content = chapters[chapterIndex].subchapters[subchapterIndex].content[contentIndex];
                        if (content.type === 'quiz') {
                            const questionCount = content.quizContent.length + 1
                            content.quizContent.push({
                                id: questionCount,
                                order: questionCount,
                                question: `Question ${questionCount}`,
                                answers: [{
                                    id: 1,
                                    order: 1,
                                    answer: 'Answer 1',
                                    isCorrect: false
                                },{
                                    id: 2,
                                    order: 2,
                                    answer: 'Answer 2',
                                    isCorrect: false
                                }],
                                singleAnswer: true
                            });
                            form.setValue('chapters', chapters);
                        }
                    }}
                    className="mt-2"
                    type="button"
                >
                    <Plus size={16} className="mr-1"/>
                    Add Question
                </Button>
            </div>
            <DeleteButton
                onClick={() =>
                    removeContentFromSubChapter(chapter.id, subchapter.id, contentItem.id)
                }
            />
        </div>

    );
};
