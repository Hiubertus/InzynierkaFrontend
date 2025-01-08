import * as z from "zod";

export interface CourseForm {
    id?: number | null;
    name: string;
    banner: File | null;
    description: string;
    chapters: ChapterForm[];
    price: number;
    duration: number;
    tags: string[];
    bannerMediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm' | null;
    bannerType: 'image' | 'video' | null;
}

export interface ChapterForm {
    id?: number | null;
    order?: number;
    name: string;
    subchapters: SubChapterForm[];
    deleted?: boolean
}

export interface SubChapterForm {
    id?: number | null;
    order?: number;
    name: string;
    content: (TextForm | MediaForm | QuizForm)[];
    deleted?: boolean
}

export interface TextForm {
    id?: number | null;
    order?: number;
    type: 'text';
    text: string;
    fontSize: "small" | "medium" | "large";
    bolder: boolean;
    italics: boolean;
    underline: boolean;
    textColor: string;
    deleted?: boolean;
}

export interface MediaForm {
    id?: number | null;
    order?: number;
    type: 'image' | 'video';
    file: File | null;
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm';
    updateFile?: boolean;
    deleted?: boolean
}

export interface QuizForm {
    id?: number | null;
    order?: number;
    type: 'quiz';
    quizContent: QuizContentForm[];
    deleted?: boolean
}

export interface QuizContentForm {
    id?: number | null;
    order?: number;
    question: string;
    answers: AnswerForm[];
    singleAnswer: boolean;
    deleted?: boolean
}

export interface AnswerForm {
    id?: number | null;
    order?: number;
    answer: string;
    isCorrect: boolean;
    deleted?: boolean
}


export const formSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, {message: "Course name is required"}),
    banner: z.custom<File>().nullable().refine((val) => val !== null, {
        message: "Banner is required"
    }),
    bannerType: z.enum(['image', 'video']),
    bannerMediaType: z.enum([
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/webm'
    ]),
    price: z.number().min(0, { message: "Price cannot be negative" }),
    duration: z.number().min(0, { message: "Duration cannot be negative" }),
    description: z.string().min(1, {message: "Course description is required"}),
    tags: z
        .array(z.string().min(1, { message: "Each tag must have at least one character" }))
        .min(1, { message: "At least one tag is required" }),
    chapters: z.array(z.object({
        id: z.number().nullable().optional(),
        name: z.string().min(1, {message: "Chapter name is required"}),
        deleted: z.boolean().optional(),
        subchapters: z.array(z.object({
            id: z.number().nullable().optional(),
            name: z.string().min(1, {message: "Subchapter name is required"}),
            deleted: z.boolean().optional(),
            content: z.array(z.discriminatedUnion('type', [
                z.object({
                    id: z.number().nullable().optional(),
                    type: z.literal('text'),
                    text: z.string().min(1, {message: "Text content is required"}),
                    fontSize: z.enum(["small", "medium", "large"]).default("medium"),
                    bolder: z.boolean().default(false),
                    italics: z.boolean().default(false),
                    underline: z.boolean().default(false),
                    textColor: z.string().default('#000000'),
                    deleted: z.boolean().optional(),
                }),
                z.object({
                    id: z.number().nullable().optional(),
                    type: z.enum(['image', 'video']),
                    file: z.custom<File>().nullable(),
                    updateFile: z.boolean().optional(),
                    mediaType: z.enum([
                        'image/jpeg', 'image/png', 'image/gif',
                        'video/mp4', 'video/webm'
                    ]),
                    deleted: z.boolean().optional(),
                }),
                z.object({
                    id: z.number().nullable().optional(),
                    type: z.literal('quiz'),
                    deleted: z.boolean().optional(),
                    quizContent: z.array(z.object({
                        id: z.number().nullable().optional(),
                        question: z.string().min(1, {message: "Question is required"}),
                        singleAnswer: z.boolean(),
                        deleted: z.boolean().optional(),
                        answers: z.array(z.object({
                            id: z.number().nullable().optional(),
                            answer: z.string().min(1, {message: "Answer text is required"}),
                            isCorrect: z.boolean(),
                            deleted: z.boolean().optional(),
                        }))
                            .min(2, {message: "At least two answers are required"})
                            .max(8, {message: "Maximum 8 answers are allowed"})
                            .refine(
                                (answers) => answers.some(answer => answer.isCorrect),
                                {message: "At least one answer must be marked as correct"}
                            ),
                    })).min(1, {message: "At least one question is required"}),
                }),
            ])).min(1, {message: "At least one content item is required"}),
        })).min(1, {message: "At least one subchapter is required"}),
    })).min(1, {message: "At least one chapter is required"}),
});