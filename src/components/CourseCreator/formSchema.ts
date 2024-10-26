import * as z from "zod";

export interface CourseForm {
    name: string;
    banner: File | null;
    description: string;
    chapters: ChapterForm[];
    price: number;
    duration: number;
    tags: string[];
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
    bolder: boolean ;
    italics: boolean;
    underline: boolean;
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
    banner: z.custom<File>().nullable().refine((val) => val !== null, {
        message: "Banner is required"
    }),
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
                    bolded: z.boolean().default(false),
                    italics: z.boolean().default(false),
                    emphasis: z.boolean().default(false),
                }),
                z.object({
                    type: z.literal('image'),
                    image: z.custom<File>().nullable().refine((val) => val !== null, {
                        message: "Image is required"
                    }),
                }),
                z.object({
                    type: z.literal('video'),
                    video: z.custom<File>().nullable().refine((val) => val !== null, {
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