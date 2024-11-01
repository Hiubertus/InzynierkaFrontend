import { useState } from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseForm, formSchema } from "@/components/CourseCreator/formSchema";
import { Button } from '@/components/ui/button';
import {Plus, Eye, Edit} from 'lucide-react';
import { Form,} from '@/components/ui/form';
import { CourseDataForm } from "@/components/CourseCreator/CourseDataForm";
import { ChapterCreator } from "@/components/CourseCreator/ChapterCreator";
import { CoursePreview} from "@/components/CourseCreator/CoursePreview";

type PreviewMode = 'editor' | 'page' | 'content';

const INITIAL_FORM_VALUES: CourseForm = {
    name: '',
    banner: null,
    bannerType: null,
    bannerMediaType: null,
    description: '',
    price: 0,
    duration: 0,
    tags: [],
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
};
const PREVIEW_MODES = [
    { mode: 'editor' as PreviewMode, icon: Edit, label: 'Editor' },
    { mode: 'page' as PreviewMode, icon: Eye, label: 'Preview Page' },
    { mode: 'content' as PreviewMode, icon: Eye, label: 'Preview Content' }
] as const;

export const CourseCreator = () => {
    const [previewMode, setPreviewMode] = useState<PreviewMode>('editor');

    const form = useForm<CourseForm>({
        resolver: zodResolver(formSchema),
        defaultValues: INITIAL_FORM_VALUES
    });

    const { fields: chapters, append: appendChapter, remove: removeChapter, swap: swapChapter } = useFieldArray({
        control: form.control,
        name: "chapters"
    });

    const handleSubmit = () => {
        console.log("test");
    };
    const handleAddChapter = () => {
        appendChapter({
            name: `Chapter ${chapters.length + 1}`,
            subchapters: [
                {
                    name: 'SubChapter 1',
                    content: []
                }
            ]
        });
    };

    const renderPreviewModeButtons = () => (
        <div className="flex justify-end gap-2 p-4 border-b">
            {PREVIEW_MODES.map(({ mode, icon: Icon, label }) => (
                <Button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    variant={previewMode === mode ? "default" : "outline"}
                    className="flex items-center gap-2"
                >
                    <Icon size={16} />
                    {label}
                </Button>
            ))}
        </div>
    );

    const renderEditor = () => (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create a New Course</h1>

                <CourseDataForm form={form} />

                {chapters.map((chapter, index) => (
                    <ChapterCreator
                        key={chapter.id}
                        chapter={chapter}
                        chaptersLength={chapters.length}
                        chapterIndex={index}
                        removeChapter={removeChapter}
                        form={form}
                        swap={swapChapter}
                    />
                ))}

                <Button
                    onClick={handleAddChapter}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    type="button"
                >
                    <Plus size={16} />
                    Add Chapter
                </Button>

                <Button type="submit" className="w-full mt-4">
                    Create Course
                </Button>
            </form>
        </Form>
    );

    const renderPreview = () => (
        <CoursePreview
            formData={form.getValues()}
            type={previewMode === 'page' ? 'page' : 'content'}
        />
    );

    return (
        <div className="w-full">
            {renderPreviewModeButtons()}
            {previewMode === 'editor' ? renderEditor() : renderPreview()}
        </div>
    );
};


export default CourseCreator;