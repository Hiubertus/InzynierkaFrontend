import {useEffect,  useState} from 'react';
import { useFieldArray, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseForm, formSchema } from "@/components/CourseCreator/formSchema";
import { Button } from '@/components/ui/button';
import {Plus, Eye, Edit, Loader2} from 'lucide-react';
import { Form,} from '@/components/ui/form';
import { CourseDataForm } from "@/components/CourseCreator/CourseDataForm";
import { ChapterCreator } from "@/components/CourseCreator/ChapterCreator";
import { CoursePreview} from "@/components/CourseCreator/CoursePreview";
import DraggableList from "@/components/CourseCreator/DraggableList/DraggableList";
import {useUserStore} from "@/lib/stores/userStore";
import {useAuthStore} from "@/lib/stores/authStore";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {createCourse} from "@/lib/course/createCourse";
import {updateCourse} from "@/lib/course/updateCourse";
import {convertBackendToFormData} from "@/models/backend_models/backendCourseToEdit";
import {getCourseToEdit} from "@/lib/course/getCourseToEdit";
import {useRealIndex} from "@/components/CourseCreator/useRealIndex";

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

interface Props {
    courseId?: number;
}

export const CourseCreator = ({courseId}: Props) => {
    const [previewMode, setPreviewMode] = useState<PreviewMode>('editor');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { accessToken } = useAuthStore();
    const { userData } = useUserStore();
    const form = useForm<CourseForm>({
        resolver: zodResolver(formSchema),
        defaultValues: INITIAL_FORM_VALUES
    });

    useEffect(() => {
        const loadCourseData = async () => {
            if (courseId && accessToken) {
                try {
                    const courseData = await getCourseToEdit(accessToken, courseId);
                    const formData = convertBackendToFormData(courseData);
                    console.log(formData)
                    form.reset(formData);

                    console.log(form.getValues())
                } catch (error) {
                    console.error('Error loading course:', error);
                    toast({
                        title: "Error",
                        description: "Failed to load course data",
                        variant: "destructive"
                    });
                }
            }
        };

        loadCourseData();
    }, [courseId, accessToken, form]);

    const { fields: chapters, append: appendChapter, remove: removeChapter, swap: swapChapter, move: moveChapter } = useFieldArray({
        control: form.control,
        name: "chapters"
    });

    const handleSubmit = async (formData: CourseForm) => {
        if (!accessToken || !userData) {
            toast({
                title: "Error",
                description: "You must be logged in to create a course",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            const isUpdate = Boolean(courseId);

            if (formData.banner) {
                data.append('banner', formData.banner);
            }

            const contentFiles: File[] = [];

            const processCourseData = () => {
                const baseCourseData = {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    duration: formData.duration,
                    tags: formData.tags,
                };

                if (isUpdate) {
                    return {
                        ...baseCourseData,
                        id: formData.id,
                        chapters: formData.chapters
                            .filter(chapter => !chapter.deleted)
                            .map((chapter, chapterIndex) => ({
                                id: chapter.id,
                                deleted: chapter.deleted,
                                name: chapter.name,
                                order: chapterIndex + 1,
                                subchapters: chapter.subchapters
                                    .filter(subchapter => !subchapter.deleted)
                                    .map((subchapter, subchapterIndex) => ({
                                        id: subchapter.id,
                                        deleted: subchapter.deleted,
                                        name: subchapter.name,
                                        order: subchapterIndex + 1,
                                        content: subchapter.content
                                            .filter(content => !content.deleted)
                                            .map((content, contentIndex) => {
                                                const baseContent = {
                                                    id: content.id,
                                                    deleted: content.deleted,
                                                    order: contentIndex + 1,
                                                    type: content.type,
                                                };

                                                switch (content.type) {
                                                    case 'text':
                                                        return {
                                                            ...baseContent,
                                                            text: content.text,
                                                            fontSize: content.fontSize,
                                                            bolder: content.bolder,
                                                            italics: content.italics,
                                                            underline: content.underline,
                                                            textColor: content.textColor,
                                                        };
                                                    case 'image':
                                                    case 'video':
                                                        if (content.file) {
                                                            contentFiles.push(content.file);
                                                        }
                                                        return {
                                                            ...baseContent,
                                                            updateFile: content.updateFile || false,
                                                        }
                                                    case 'quiz':
                                                        return {
                                                            ...baseContent,
                                                            quizContent: content.quizContent
                                                                .filter(quiz => !quiz.deleted)
                                                                .map((quiz, qIndex) => ({
                                                                    id: quiz.id,
                                                                    deleted: quiz.deleted,
                                                                    order: qIndex + 1,
                                                                    question: quiz.question,
                                                                    singleAnswer: quiz.singleAnswer,
                                                                    answers: quiz.answers
                                                                        .filter(answer => !answer.deleted)
                                                                        .map((answer, aIndex) => ({
                                                                            id: answer.id,
                                                                            deleted: answer.deleted,
                                                                            order: aIndex + 1,
                                                                            answer: answer.answer,
                                                                            isCorrect: answer.isCorrect,
                                                                        })),
                                                                })),
                                                        };
                                                }
                                            }),
                                    })),
                            }))
                    };
                }

                return {
                    ...baseCourseData,
                    chapters: formData.chapters
                        .map((chapter, chapterIndex) => ({
                            name: chapter.name,
                            order: chapterIndex + 1,
                            subchapters: chapter.subchapters
                                .map((subchapter, subchapterIndex) => ({
                                    name: subchapter.name,
                                    order: subchapterIndex + 1,
                                    content: subchapter.content
                                        .map((content, contentIndex) => {
                                            const baseContent = {
                                                order: contentIndex + 1,
                                                type: content.type,
                                            };

                                            switch (content.type) {
                                                case 'text':
                                                    return {
                                                        ...baseContent,
                                                        text: content.text,
                                                        fontSize: content.fontSize,
                                                        bolder: content.bolder,
                                                        italics: content.italics,
                                                        underline: content.underline,
                                                        textColor: content.textColor,
                                                    };
                                                case 'image':
                                                case 'video':
                                                    if (content.file) {
                                                        contentFiles.push(content.file);
                                                    }
                                                    return baseContent;
                                                case 'quiz':
                                                    return {
                                                        ...baseContent,
                                                        quizContent: content.quizContent
                                                            .map((quiz, qIndex) => ({
                                                                order: qIndex + 1,
                                                                question: quiz.question,
                                                                singleAnswer: quiz.singleAnswer,
                                                                answers: quiz.answers
                                                                    .map((answer, aIndex) => ({
                                                                        order: aIndex + 1,
                                                                        answer: answer.answer,
                                                                        isCorrect: answer.isCorrect,
                                                                    })),
                                                            })),
                                                    };
                                            }
                                        }),
                                })),
                        }))
                };
            };

            const courseData = processCourseData();

            data.append('courseData', JSON.stringify(courseData));

            contentFiles.forEach(file => {
                data.append('contentFiles', file);
            });

            console.log(contentFiles);

            const result = isUpdate
                ? await updateCourse(data, accessToken)
                : await createCourse(data, accessToken);


            if (result.success) {
                toast({
                    title: "Success",
                    description: `Course ${isUpdate ? 'updated' : 'created'} successfully`
                });
                router.push('/');
            } else {
                toast({
                    title: "Error",
                    description: result.message || `Failed to ${isUpdate ? 'update' : 'create'} course`,
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: String(err),
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddChapter = () => {
        if (!courseId) {
            appendChapter({
                name: `Chapter ${chapters.length + 1}`,
                subchapters: [
                    {
                        name: 'SubChapter 1',
                        content: []
                    }
                ]
            });
        }
        else {
            appendChapter({
                id: null,
                name: `Chapter ${chapters.length + 1}`,
                deleted: false,
                subchapters: [
                    {
                        id: null,
                        name: 'SubChapter 1',
                        deleted: false,
                        content: []
                    }
                ]
            });
        }
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



    const watchedValues = form.watch('chapters');

    const visibleChapters = () => {
        return chapters.filter((_, index) => {
            const watchedChapter = watchedValues[index];
            return !courseId || !watchedChapter.deleted
        });
    }

    const calculateRealIndex = useRealIndex(watchedValues);

    const handleRemoveChapter = (visibleIndex: number) => {
        const chapter = visibleChapters()[visibleIndex];
        if (!courseId || isNaN(Number(chapter.id))) {
            removeChapter(visibleIndex);
        } else {
            const realIndex = calculateRealIndex(visibleIndex);
            form.setValue(`chapters.${realIndex}.deleted`, true);
        }
    };

    const renderEditor = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create a New Course</h1>

                <CourseDataForm form={form} />

                <DraggableList
                    items={visibleChapters()}
                    onReorder={(newOrder) => {
                        const movedItemId = newOrder.find((item, index) =>
                            item.id !== visibleChapters()[index].id);
                        if (movedItemId) {
                            const oldIndex = chapters.findIndex(item => item.id === movedItemId);
                            const newIndex = newOrder.findIndex(item => item.id === movedItemId);
                            moveChapter(oldIndex, newIndex);
                        }
                    }}
                    getId={(item) => item.id}
                    renderItem={(chapter, index) => (
                        <ChapterCreator
                            key={chapter.id}
                            chapter={chapter}
                            chaptersLength={visibleChapters().length}
                            chapterIndex={index}
                            removeChapter={handleRemoveChapter}
                            form={form}
                            swap={swapChapter}
                            courseId={courseId}
                        />
                    )}
                    className="space-y-4"
                    itemClassName="hover:shadow-md"
                    activationDelay={250}
                />

                <Button
                    onClick={handleAddChapter}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    type="button"
                >
                    <Plus size={16} />
                    Add Chapter
                </Button>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Course...
                        </>
                    ) : (
                        'Create Course'
                    )}
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