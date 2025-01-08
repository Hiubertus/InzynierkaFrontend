import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {ContentButtons} from "@/components/CourseCreator/ContentButtons";
import { useFieldArray, UseFormReturn} from "react-hook-form";
import {CourseForm, MediaForm, QuizForm, TextForm} from "@/components/CourseCreator/formSchema";
import {ContentCreator} from "@/components/CourseCreator/ContentCreator";
import OrderButtons from "@/components/CourseCreator/OrderButtons";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";
import {FC} from "react";
import {useRealIndex} from "@/components/CourseCreator/useRealIndex";

interface SubChapterCreatorProps {
    subChaptersLength: number;
    chapterIndex: number;
    subChapterIndex: number;
    removeSubChapter: (index: number) => void;
    form: UseFormReturn<CourseForm>;
    swap: (from: number, to: number) => void;
    courseId?: number;
}

export const SubChapterCreator: FC<SubChapterCreatorProps> = ({
                                                                        chapterIndex,
                                                                        subChapterIndex,
                                                                        subChaptersLength,
                                                                        removeSubChapter,
                                                                        form,
                                                                        swap,
                                                                        courseId
                                                                    }) => {
    const {
        fields: contents,
        append: appendContent,
        remove: removeContent,
        swap: swapContent,
        move: moveContent
    } = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content`
    });

    const watchedContents = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content`);

    const visibleContents = () => {
        return contents.filter((_, index) => {
            const watchedContent = watchedContents[index];
            return !courseId || !watchedContent.deleted;
        });
    }

    const calculateRealIndex = useRealIndex(watchedContents);

    const handleRemoveContent = (visibleIndex: number) => {

        const content = visibleContents()[visibleIndex];
        console.log(content)
        if (!courseId || isNaN(Number(content.id))) {
            removeContent(visibleIndex);
        } else {
            const realIndex = calculateRealIndex(visibleIndex);
            form.setValue(
                `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${realIndex}.deleted`,
                true
            );
        }
    };

    const handleAppendContent = (newContent: MediaForm | TextForm | QuizForm) => {
        const visibleLength = visibleContents().length;

        if (!courseId) {
            appendContent({
                ...newContent,
                order: visibleLength + 1
            });
        } else {
            appendContent({
                ...newContent,
                id: null,
                deleted: false,
                order: visibleLength + 1
            });
        }
    };

    return (
        <Card className="border-l-2 border-l-indigo-300">
            <CardHeader className="flex flex-col bg-indigo-100 overflow-hidden">
                <div className="flex w-full">
                    <OrderButtons
                        onMoveUp={() => swap(subChapterIndex, subChapterIndex - 1)}
                        onMoveDown={() => swap(subChapterIndex, subChapterIndex + 1)}
                        canMoveUp={subChapterIndex > 0}
                        canMoveDown={subChapterIndex < subChaptersLength - 1}
                    />
                    <div className="flex-1">
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
                </div>
            </CardHeader>
            <CardContent className="bg-indigo-50">
                <DraggableList
                    items={visibleContents()}
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) =>
                            item.id !== visibleContents()[index].id);
                        if (movedItemId) {
                            const oldIndex = contents.findIndex(item => item.id === movedItemId);
                            const newIndex = newOrder.findIndex(item => item.id === movedItemId);
                            moveContent(oldIndex, newIndex);
                        }
                    }}
                    getId={(item) => item.id}
                    renderItem={(content, index) => (
                        <ContentCreator
                            key={content.id}
                            content={content}
                            form={form}
                            chapterIndex={chapterIndex}
                            subChapterIndex={subChapterIndex}
                            contentIndex={index}
                            removeContent={handleRemoveContent}
                            swap={swapContent}
                            contentsLength={visibleContents().length}
                            courseId={courseId}
                        />
                    )}
                    className="space-y-4"
                    itemClassName="hover:shadow-md"
                    activationDelay={200}
                />
                <ContentButtons
                    appendContent={handleAppendContent}
                    courseId={courseId}
                />
            </CardContent>
        </Card>
    );
};