import React from 'react';
import {
    useForm,
} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {formSchema} from "@/components/CourseCreator/formSchema";
import {useCreateCourseStore} from '@/lib/stores/createCourseStore';
import {Button} from '@/components/ui/button';
import {Card, CardHeader, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import { Course } from "@/components/Course/Course";
import {
    Plus,
} from 'lucide-react';
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import {CourseDataForm} from "@/components/CourseCreator/CourseDataForm";
import {ContentTextForm} from "@/components/CourseCreator/ContentTextForm";
import {ContentFileForm} from "@/components/CourseCreator/ContentFileForm";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {ContentQuizForm} from "@/components/CourseCreator/ContentQuizForm";
import {ContentButtons} from "@/components/CourseCreator/ContentButtons";


export const CourseCreator = () => {
    const {
        course,
        setCourseName,
        setCourseBanner,
        setCourseDescription,
        addChapter,
        removeChapter,
        updateChapterName,
        addSubChapter,
        removeSubChapter,
        updateSubChapterName,
        addContentToSubChapter,
        removeContentFromSubChapter,
        updateTextContent,
        updateVideoContent,
        updateImageContent,
        addQuizQuestion,
        removeQuizQuestion,
        updateQuizQuestion,
        addQuizAnswer,
        removeQuizAnswer,
        updateQuizAnswer,
    } = useCreateCourseStore();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: course,
    });

    const onSubmit = () => {
        console.log("test");
    };


    return (
        <div>
            <Course course={course}/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Create a New Course</h1>

                    <CourseDataForm
                        form={form}
                        setCourseName={setCourseName}
                        setCourseBanner={setCourseBanner}
                        setCourseDescription={setCourseDescription}
                    />

                    {course.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapter.id} className="mb-4 shadow-md border-l-4 border-l-blue-300">
                            <CardHeader className="flex flex-col bg-blue-100 overflow-hidden">
                                <div className={"w-full"}>
                                    <FormField
                                        control={form.control}
                                        name={`chapters.${chapterIndex}.name`}
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormControl>
                                                    <div className="flex justify-between">
                                                        <Input
                                                            {...field}
                                                            placeholder={`Chapter ${chapterIndex + 1} Name`}
                                                            value={chapter.name}
                                                            onChange={(e) => {
                                                                updateChapterName(chapter.id, e.target.value);
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                        <DeleteButton
                                                            onClick={() => {
                                                                if (course.chapters.length > 1) {
                                                                    removeChapter(chapter.id);
                                                                    // const updatedChapters = form.getValues('chapters').filter((_, i) => i !== chapterIndex);
                                                                    // form.setValue('chapters', updatedChapters);
                                                                }
                                                            }}
                                                            disabled={course.chapters.length <= 1}
                                                        />
                                                    </div>

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 bg-indigo-200">
                                {chapter.subchapters.map((subchapter, subchapterIndex) => (
                                    <Card key={subchapter.id} className="border-l-2 border-l-indigo-300">
                                        <CardHeader className="flex flex-col bg-indigo-100 overflow-hidden">
                                            <div className="w-full">
                                                <FormField
                                                    control={form.control}
                                                    name={`chapters.${chapterIndex}.subchapters.${subchapterIndex}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className={"w-full flex justify-between"}>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder={`Subchapter ${subchapterIndex + 1} Name`}
                                                                        value={subchapter.name}
                                                                        onChange={(e) => {
                                                                            updateSubChapterName(chapter.id, subchapter.id, e.target.value);
                                                                            field.onChange(e);
                                                                        }}
                                                                    />
                                                                    <DeleteButton
                                                                        onClick={() => {
                                                                            if (chapter.subchapters.length > 1) {
                                                                                removeSubChapter(chapter.id, subchapter.id);
                                                                                // const updatedSubchapters = form
                                                                                //     .getValues('chapters')[chapterIndex]
                                                                                //     .subchapters.filter((_, i) => i !== subchapterIndex);
                                                                                // form.setValue(`chapters.${chapterIndex}.subchapters`, updatedSubchapters);
                                                                            }
                                                                        }}
                                                                        disabled={chapter.subchapters.length <= 1}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="bg-indigo-50">
                                            {subchapter.content.map((contentItem, contentIndex) => (
                                                <div key={contentItem.id} className="flex flex-col rounded-lg overflow-hidden py-4">
                                                    <div className="w-full">
                                                        {contentItem.type === 'text' && (
                                                            <ContentTextForm
                                                                form={form}
                                                                contentItem={contentItem}
                                                                chapter={chapter}
                                                                subchapter={subchapter}
                                                                chapterIndex={chapterIndex}
                                                                subchapterIndex={subchapterIndex}
                                                                contentIndex={contentIndex}
                                                                updateTextContent={updateTextContent}
                                                                removeContentFromSubChapter={removeContentFromSubChapter}
                                                            />
                                                        )}
                                                        {(contentItem.type === 'video' || contentItem.type === 'image') && (
                                                            <ContentFileForm
                                                                form={form}
                                                                contentItem={contentItem}
                                                                chapter={chapter}
                                                                subchapter={subchapter}
                                                                chapterIndex={chapterIndex}
                                                                subchapterIndex={subchapterIndex}
                                                                contentIndex={contentIndex}
                                                                updateVideoContent={updateVideoContent}
                                                                updateImageContent={updateImageContent}
                                                                removeContentFromSubChapter={removeContentFromSubChapter}
                                                            />
                                                        )}
                                                        {contentItem.type === 'quiz' && (
                                                            <ContentQuizForm
                                                                form={form}
                                                                contentItem={contentItem}
                                                                chapter={chapter}
                                                                subchapter={subchapter}
                                                                chapterIndex={chapterIndex}
                                                                subchapterIndex={subchapterIndex}
                                                                contentIndex={contentIndex}
                                                                addQuizQuestion={addQuizQuestion}
                                                                removeQuizQuestion={removeQuizQuestion}
                                                                updateQuizQuestion={updateQuizQuestion}
                                                                addQuizAnswer={addQuizAnswer}
                                                                removeQuizAnswer={removeQuizAnswer}
                                                                updateQuizAnswer={updateQuizAnswer}
                                                                removeContentFromSubChapter={removeContentFromSubChapter}
                                                            />
                                                        )}

                                                    </div>
                                                </div>
                                            ))}
                                            <ContentButtons
                                                chapterId={chapter.id}
                                                subchapterId={subchapter.id}
                                                addContentToSubChapter={addContentToSubChapter}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    onClick={() => addSubChapter(chapter.id)}
                                    variant="outline"
                                    className="w-full mt-4 flex items-center justify-center"
                                    type="button"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Subchapter
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    <Button onClick={addChapter} variant="outline" className="w-full flex items-center justify-center" type="button">
                        <Plus size={16} className="mr-1" />
                        Add Chapter
                    </Button>

                    <Button type="submit" className="w-full mt-4">
                        Create Course
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CourseCreator;