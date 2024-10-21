import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";
import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {QuestionCreator} from "@/components/CourseCreator/QuestionCreator";

interface ContentQuizFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    removeContent: (index: number) => void;
}


export const ContentQuizForm: React.FC<ContentQuizFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    removeContent
                                                                }) => {

    const {fields: questions, append: appendQuestion, remove: removeQuestion} = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent`
    });

    return (
        <div className={"flex justify-between"}>
            <div
                 className="space-y-4 p-4 w-full bg-indigo-50 border border-gray-200 border-l-2 border-l-indigo-300">
                {questions.map((question, questionIndex) => (
                    <QuestionCreator key={question.id} form={form} questionsLength={questions.length}
                                     chapterIndex={chapterIndex} subChapterIndex={subChapterIndex}
                                     contentIndex={contentIndex} questionIndex={questionIndex}
                                     removeQuestion={removeQuestion}/>
                    ))}
                <Button
                    onClick={() => {
                        appendQuestion({
                            question: `Question 1`,
                            answers: [{
                                answer: 'Answer 1',
                                isCorrect: false
                            }, {
                                answer: 'Answer 2',
                                isCorrect: false
                            }],
                            singleAnswer: true
                        });
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
                    removeContent(contentIndex)
                }
            />
        </div>

    );
};
