import React from 'react';
import { Course } from "@/components/Course/Course";
import { CourseForm } from "@/components/CourseCreator/formSchema";
import { CourseData } from "@/models/CourseData";

export const CoursePreview = ({ formData }: { formData: CourseForm }) => {
    // Konwertuje dane z formularza na format CourseData
    const convertFormToCourseData = (form: CourseForm): CourseData => {
        return {
            id: 0, // Placeholder ID
            name: form.name,
            banner: form.banner,
            review: 0, // Placeholder review
            userProfileID: 0, // Placeholder userProfileID
            description: form.description,
            chapters: form.chapters.map((chapter, chapterIndex) => ({
                id: chapterIndex + 1, // Placeholder ID
                order: chapterIndex + 1,
                name: chapter.name,
                review: 0, // Placeholder review
                subchapters: chapter.subchapters.map((subchapter, subchapterIndex) => ({
                    id: subchapterIndex + 1, // Placeholder ID
                    order: subchapterIndex + 1,
                    name: subchapter.name,
                    completed: false,
                    content: subchapter.content.map((content, contentIndex) => {
                        const baseContent = {
                            id: contentIndex + 1,
                            order: contentIndex + 1,
                        };

                        switch (content.type) {
                            case 'text':
                                return {
                                    ...baseContent,
                                    type: 'text' as const,
                                    text: content.text,
                                    fontSize: content.fontSize,
                                    fontWeight: content.fontWeight,
                                    italics: content.italics,
                                    emphasis: content.emphasis,
                                };
                            case 'video':
                                return {
                                    ...baseContent,
                                    type: 'video' as const,
                                    video: content.video,
                                };
                            case 'image':
                                return {
                                    ...baseContent,
                                    type: 'image' as const,
                                    image: content.image,
                                };
                            case 'quiz':
                                return {
                                    ...baseContent,
                                    type: 'quiz' as const,
                                    quizContent: content.quizContent.map((quiz, quizIndex) => ({
                                        id: quizIndex + 1,
                                        order: quizIndex + 1,
                                        question: quiz.question,
                                        singleAnswer: quiz.singleAnswer,
                                        answers: quiz.answers.map((answer, answerIndex) => ({
                                            id: answerIndex + 1,
                                            order: answerIndex + 1,
                                            answer: answer.answer,
                                            isCorrect: answer.isCorrect,
                                        })),
                                    })),
                                };
                            default:
                                return baseContent;
                        }
                    }),
                })),
            })),
        } as CourseData;
    };

    const courseData = convertFormToCourseData(formData);

    return <Course course={courseData} />;
};
