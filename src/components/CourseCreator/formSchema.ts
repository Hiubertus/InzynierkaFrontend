import * as z from "zod";

export interface CourseForm {
    name: string;
    banner: File | null;
    description: string;
    chapters: ChapterForm[];
    price: number;
    duration: number;
    tags: string[];
    bannerMediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm';
    bannerType: 'image' | 'video';
}

export interface ChapterForm {
    name: string;
    subchapters: SubChapterForm[];
}

export interface SubChapterForm {
    name: string;
    content: (TextForm | MediaForm | QuizForm)[];
}

export interface TextForm {
    type: 'text';
    text: string;
    fontSize: "small" | "medium" | "large";
    bolder: boolean;
    italics: boolean;
    underline: boolean;
    textColor: string;
}

export interface MediaForm {
    type: 'image' | 'video';
    file: File | null;
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm';
}

export interface QuizForm {
    type: 'quiz';
    quizContent: QuizContentForm[];
}

export interface QuizContentForm {
    question: string;
    answers: AnswerForm[];
    singleAnswer: boolean;
}

export interface AnswerForm {
    answer: string;
    isCorrect: boolean;
}

export const formSchema = z.object({
    name: z.string().min(1, {message: "Course name is required"}),
    banner: z.custom<File>().nullable().refine((val) => val !== null, {
        message: "Banner is required"
    }),
    bannerType: z.enum(['image', 'video']),
    bannerMediaType: z.enum([
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/webm'
    ]),
    price: z.number().positive(),
    duration: z.number().positive(),
    description: z.string().min(1, {message: "Course description is required"}),
    tags: z
        .array(z.string().min(1, { message: "Each tag must have at least one character" }))
        .min(1, { message: "At least one tag is required" }),
    chapters: z.array(z.object({
        name: z.string().min(1, {message: "Chapter name is required"}),
        subchapters: z.array(z.object({
            name: z.string().min(1, {message: "Subchapter name is required"}),
            completed: z.boolean().optional().default(false),
            content: z.array(z.discriminatedUnion('type', [
                z.object({
                    type: z.literal('text'),
                    text: z.string().min(1, {message: "Text content is required"}),
                    fontSize: z.enum(["small", "medium", "large"]).default("medium"),
                    bolder: z.boolean().default(false),
                    italics: z.boolean().default(false),
                    underline: z.boolean().default(false),
                    textColor: z.string().default('black'),
                }),
                z.object({
                    type: z.enum(['image', 'video']),
                    file: z.custom<File>().nullable().refine((val) => val !== null, {
                        message: "Media file is required"
                    }),
                    mediaType: z.enum([
                        'image/jpeg', 'image/png', 'image/gif',
                        'video/mp4', 'video/webm'
                    ]),
                }),
                z.object({
                    type: z.literal('quiz'),
                    quizContent: z.array(z.object({
                        question: z.string().min(1, {message: "Question is required"}),
                        singleAnswer: z.boolean(),
                        answers: z.array(z.object({
                            answer: z.string().min(1, {message: "Answer text is required"}),
                            isCorrect: z.boolean(),
                        }))
                            .min(2, {message: "At least two answers are required"})
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