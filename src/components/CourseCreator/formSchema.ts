import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(1, { message: "Course name is required" }),
    banner: z.instanceof(File, { message: "Banner image is required" }),
    description: z.string().min(1, { message: "Course description is required" }),
    chapters: z.array(z.object({
        name: z.string().min(1, { message: "Chapter name is required" }),
        order: z.number().int().nonnegative(),
        subchapters: z.array(z.object({
            name: z.string().min(1, { message: "Subchapter name is required" }),
            order: z.number().int().nonnegative(),
            content: z.array(z.object({
                order: z.number().int().nonnegative(),
                content: z.array(z.discriminatedUnion('type', [
                    z.object({
                        type: z.literal('text'),
                        text: z.string().min(1, { message: "Text content is required" }),
                    }),
                    z.object({
                        type: z.literal('image'),
                        image: z.instanceof(File, { message: "Image file is required" }),
                    }),
                    z.object({
                        type: z.literal('video'),
                        video: z.instanceof(File, { message: "Video file is required" }),
                    }),
                    z.object({
                        type: z.literal('quiz'),
                        quizContent: z.array(z.object({
                            question: z.string().min(1, { message: "Question is required" }),
                            answers: z.array(z.object({
                                answer: z.string().min(1, { message: "Answer text is required" }),
                                isCorrect: z.boolean(),
                            })).min(2, { message: "At least two answers are required" }),
                            singleAnswer: z.boolean(),
                        })).min(1, { message: "At least one question is required" }),
                    }),
                ])).min(1, { message: "At least one content item is required" }),
            })).min(1, { message: "At least one content item is required" }),
        })).min(1, { message: "At least one subchapter is required" }),
    })).min(1, { message: "At least one chapter is required" }),
});