import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {FC, useEffect} from "react";
import {CourseForm} from "@/components/CourseCreator/formSchema";
import {FieldArrayWithId, useFieldArray, UseFormReturn} from "react-hook-form";
import {SubChapterCreator} from "@/components/CourseCreator/SubChapterCreator";
import OrderButtons from "@/components/CourseCreator/OrderButtons";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";
import {useRealIndex} from "@/components/CourseCreator/useRealIndex";

interface ChapterCreatorProps {
    chapter: FieldArrayWithId<CourseForm, "chapters", "id">;
    chaptersLength: number;
    chapterIndex: number;
    removeChapter: (index: number) => void;
    form: UseFormReturn<CourseForm>;
    swap: (from: number, to: number) => void;
    courseId?: number
}

export const ChapterCreator: FC<ChapterCreatorProps> = ({
                                                                  courseId,
                                                                  chapter,
                                                                  chapterIndex,
                                                                  chaptersLength,
                                                                  removeChapter,
                                                                  form,
                                                                  swap,
                                                              }) => {
    const {fields: subChapters, append: appendSubChapter, remove: removeSubChapter, swap: swapSubChapter, move: moveSubChapter} = useFieldArray({
        control: form.control,
        name: `chapters.${chapterIndex}.subchapters`
    });


    const handleAddSubChapter = () => {
        if (!courseId) {
            appendSubChapter({
                name: `SubChapter ${subChapters.length + 1}`,
                content: []
            });
        } else {
            appendSubChapter({
                id: null,
                name: `SubChapter ${subChapters.length + 1}`,
                deleted: false,
                content: []
            });
        }
    };


    const watchedSubChapters = form.watch(`chapters.${chapterIndex}.subchapters`);

    const visibleSubChapters = () => {
        return subChapters.filter((_, index) => {
            const watchedSubChapter = watchedSubChapters[index];
            return !courseId || !watchedSubChapter.deleted;
        });
    }

    const calculateRealIndex = useRealIndex(watchedSubChapters);

    const handleRemoveSubChapter = (visibleIndex: number) => {
        const subChapter = visibleSubChapters()[visibleIndex];
        if (!courseId || isNaN(Number(subChapter.id))) {
            removeSubChapter(visibleIndex);
        } else {
            const realIndex = calculateRealIndex(visibleIndex);
            form.setValue(`chapters.${chapterIndex}.subchapters.${realIndex}.deleted`, true);
        }
    };

    useEffect(() => {
        form.setValue(`chapters.${chapterIndex}.name`, chapter.name);
    }, [chapterIndex, form, chapter.name]);

    return (
        <Card className="mb-4 shadow-md border-l-4 border-l-blue-300">
            <CardHeader className="flex flex-col bg-blue-100 overflow-hidden">
                <div className="flex w-full">
                    <OrderButtons
                        onMoveUp={() => swap(chapterIndex, chapterIndex - 1)}
                        onMoveDown={() => swap(chapterIndex, chapterIndex + 1)}
                        canMoveUp={chapterIndex > 0}
                        canMoveDown={chapterIndex < chaptersLength - 1}
                    />
                    <div className="flex-1">
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
                </div>
            </CardHeader>
            <CardContent className="space-y-4 bg-indigo-200">
                <DraggableList
                    items={visibleSubChapters()} // używamy przefiltrowanej listy
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) =>
                            item.id !== visibleSubChapters()[index].id);
                        if (movedItemId) {
                            const oldIndex = subChapters.findIndex(item => item.id === movedItemId);
                            const newIndex = newOrder.findIndex(item => item.id === movedItemId);
                            moveSubChapter(oldIndex, newIndex);
                        }
                    }}
                    getId={(item) => item.id}
                    renderItem={(subChapter, index) => (
                        <SubChapterCreator
                            key={subChapter.id}
                            subChaptersLength={visibleSubChapters().length}
                            chapterIndex={chapterIndex}
                            subChapterIndex={index}
                            removeSubChapter={handleRemoveSubChapter}
                            form={form}
                            swap={swapSubChapter}
                            courseId={courseId}
                        />
                    )}
                    className="space-y-4"
                    itemClassName="hover:shadow-md"
                    activationDelay={250}
                />
                <Button
                    onClick={handleAddSubChapter}
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