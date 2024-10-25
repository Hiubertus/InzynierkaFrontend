import React, { useState } from 'react';
import {
    useFieldArray,
    useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseForm, formSchema } from "@/components/CourseCreator/formSchema";
import { Button } from '@/components/ui/button';
import {
    Plus,
    Eye,
    Edit
} from 'lucide-react';
import {
    Form,
} from '@/components/ui/form';
import { CourseDataForm } from "@/components/CourseCreator/CourseDataForm";
import { ChapterCreator } from "@/components/CourseCreator/ChapterCreator";
import { CoursePreview} from "@/components/CourseCreator/CoursePreview";

export const CourseCreator = () => {
    const [isPreview, setIsPreview] = useState(false);

    const form = useForm<CourseForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            banner: null,
            description: '',
            chapters: [
                {
                    name: 'Chapter 1',
                    subchapters: [
                        {
                            name: 'SubChapter 1',
                            content: []
                        }
                    ]
                }
            ]
        },
    });

    const { fields: chapters, append: appendChapter, remove: removeChapter } = useFieldArray({
        control: form.control,
        name: "chapters"
    });

    const onSubmit = () => {
        console.log("test");
    };

    return (
        <div className="w-full">
            <div className="flex justify-end gap-2 p-4 border-b">
                <Button
                    onClick={() => setIsPreview(false)}
                    variant={!isPreview ? "default" : "outline"}
                    className="flex items-center gap-2"
                >
                    <Edit size={16} />
                    Editor
                </Button>
                <Button
                    onClick={() => setIsPreview(true)}
                    variant={isPreview ? "default" : "outline"}
                    className="flex items-center gap-2"
                >
                    <Eye size={16} />
                    Preview
                </Button>
            </div>

            {isPreview ? (
                <CoursePreview formData={form.getValues()} />
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Create a New Course</h1>
                        <CourseDataForm
                            form={form}
                        />
                        {chapters.map((chapter, chapterIndex) => (
                            <ChapterCreator
                                key={chapter.id}
                                chapter={chapter}
                                chaptersLength={chapters.length}
                                chapterIndex={chapterIndex}
                                removeChapter={removeChapter}
                                form={form}
                            />
                        ))}

                        <Button
                            onClick={() => appendChapter({
                                name: `Chapter ${chapters.length + 1}`,
                                subchapters: [
                                    {
                                        name: `SubChapter 1`,
                                        content: [],
                                    }
                                ]
                            })}
                            variant="outline"
                            className="w-full flex items-center justify-center"
                            type="button"
                        >
                            <Plus size={16} className="mr-1"/>
                            Add Chapter
                        </Button>

                        <Button type="submit" className="w-full mt-4">
                            Create Course
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default CourseCreator;