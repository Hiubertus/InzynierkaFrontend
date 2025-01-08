import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import { useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {QuestionCreator} from "@/components/CourseCreator/QuestionCreator";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";
import {FC} from "react";
import {useRealIndex} from "@/components/CourseCreator/useRealIndex";

interface ContentQuizFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    removeContent: (index: number) => void;
    courseId?: number
}

export const ContentQuizForm: FC<ContentQuizFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    removeContent,
                                                                    courseId
                                                                }) => {
    const {
        fields: questions,
        append: appendQuestion,
        remove: removeQuestion,
        swap: swapQuestion,
        move: moveQuestion
    } = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent`
    });

    const watchedQuestions = form.watch(
        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent`
    );

    const visibleQuestions = () => {
        return questions.filter((question, index) => {
            const watchedQuestion = watchedQuestions[index];
            return !courseId || !watchedQuestion.deleted;
        });
    }

    const calculateRealIndex = useRealIndex(watchedQuestions);

    const handleRemoveQuestion = (visibleIndex: number) => {
        const question = visibleQuestions()[visibleIndex];
        if (!courseId || isNaN(Number(question.id))) {
            removeQuestion(visibleIndex);
        } else {
            const realIndex = calculateRealIndex(visibleIndex);
            form.setValue(
                `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.quizContent.${realIndex}.deleted`,
                true
            );
        }
    };

    const handleAppendQuestion = () => {
        if (!courseId) {
            appendQuestion({
                question: `Question ${questions.length + 1}`,
                answers: [{
                    answer: 'Answer 1',
                    isCorrect: false
                }, {
                    answer: 'Answer 2',
                    isCorrect: false
                }],
                singleAnswer: true
            });
        } else {
            appendQuestion({
                id: null,
                question: `Question ${questions.length + 1}`,
                answers: [{
                    id: null,
                    answer: 'Answer 1',
                    isCorrect: false,
                    deleted: false
                }, {
                    id: null,
                    answer: 'Answer 2',
                    isCorrect: false,
                    deleted: false
                }],
                singleAnswer: true,
                deleted: false
            });
        }
    };


    return (
        <div className="flex justify-between">
            <div className="space-y-4 p-4 w-full bg-indigo-50 border border-gray-200 border-l-2 border-l-indigo-300">
                <DraggableList
                    items={visibleQuestions()}
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) =>
                            item.id !== visibleQuestions()[index].id);
                        if (movedItemId) {
                            const oldIndex = questions.findIndex(item => item.id === movedItemId);
                            const newIndex = newOrder.findIndex(item => item.id === movedItemId);
                            moveQuestion(oldIndex, newIndex);
                        }
                    }}
                    getId={(item) => item.id}
                    renderItem={(question, index) => (
                        <QuestionCreator
                            key={question.id}
                            form={form}
                            questionsLength={visibleQuestions().length}
                            chapterIndex={chapterIndex}
                            subChapterIndex={subChapterIndex}
                            contentIndex={contentIndex}
                            questionIndex={index}
                            removeQuestion={handleRemoveQuestion}
                            swap={swapQuestion}
                            courseId={courseId}
                        />
                    )}
                    className="space-y-4"
                    itemClassName="hover:shadow-md"
                    activationDelay={250}
                />
                <Button
                    onClick={handleAppendQuestion}
                    className="mt-2"
                    type="button"
                >
                    <Plus size={16} className="mr-1"/>
                    Add Question
                </Button>
            </div>
            <DeleteButton
                onClick={() => removeContent(contentIndex)}
            />
        </div>
    );
};