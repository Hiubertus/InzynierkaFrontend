import * as z from "zod";

export interface CourseForm {
    name: string;
    banner: File | null;
    description: string;
    chapters: ChapterForm[];
}
export interface ChapterForm {
    name: string;
    subchapters: SubChapterForm[];
}
export interface SubChapterForm {
    name: string;
    content: (TextForm | VideoForm | ImageForm | QuizForm)[];
}
export interface TextForm {
    type: 'text';
    text: string;
    fontSize: "small" | "medium" | "large";
    fontWeight: "normal" | "bold" | "bolder";
    italics: boolean;
    emphasis: boolean;
}
export interface ImageForm {
    type: 'image';
    image: File | null
}
export interface VideoForm {
    type: 'video';
    video: File | null;
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
    banner: z.string().nullable().refine((val) => val !== null, {
        message: "Banner is required"
    }),
    description: z.string().min(1, {message: "Course description is required"}),
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
                    fontWeight: z.enum(["normal", "bold", "bolder"]).default("normal"),
                    italics: z.boolean().default(false),
                    emphasis: z.boolean().default(false),
                }),
                z.object({
                    type: z.literal('image'),
                    image: z.string().nullable().refine((val) => val !== null, {
                        message: "Image is required"
                    })
                }),
                z.object({
                    type: z.literal('video'),
                    video: z.string().nullable().refine((val) => val !== null, {
                        message: "Video is required"
                    }),
                }),
                z.object({
                    type: z.literal('quiz'),
                    quizContent: z.array(z.object({
                        question: z.string().min(1, {message: "Question is required"}),
                        singleAnswer: z.boolean(),
                        answers: z.array(z.object({
                            answer: z.string().min(1, {message: "Answer text is required"}),
                            isCorrect: z.boolean(),
                        })).min(2, {message: "At least two answers are required"}),
                    })).min(1, {message: "At least one question is required"}),
                }),
            ])).min(1, {message: "At least one content item is required"}),
        })).min(1, {message: "At least one subchapter is required"}),
    })).min(1, {message: "At least one chapter is required"}),
});