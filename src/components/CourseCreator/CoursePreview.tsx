import React from 'react';
import { Course } from "@/components/Course/Course";
import { CourseForm } from "@/components/CourseCreator/formSchema";
import { CourseData } from "@/models/CourseData";
import CourseFrontPage from "@/components/Course/CourseFrontPage";

export const CoursePreview = ({ formData, type }: { formData: CourseForm, type: 'page' | 'content' }) => {
    const convertFormToCourseData = (form: CourseForm): CourseData => {
        return {
            id: 0,
            name: form.name,
            banner: form.banner,
            price: form.price || 0,
            review: 0,
            reviewNumber: 0,
            duration: form.duration || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: form.tags || [],
            ownerId: 0,
            description: form.description,
            chapters: form.chapters.map((chapter, chapterIndex) => ({
                id: chapterIndex + 1,
                order: chapterIndex + 1,
                name: chapter.name,
                review: 0,
                subchapters: chapter.subchapters.map((subchapter, subchapterIndex) => ({
                    id: subchapterIndex + 1,
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
                                    type: 'text',
                                    text: content.text,
                                    fontSize: content.fontSize,
                                    bolder: content.bolder,
                                    italics: content.italics,
                                    underline: content.underline,
                                };
                            case 'video':
                                return {
                                    ...baseContent,
                                    type: 'video',
                                    video: content.video,
                                };
                            case 'image':
                                return {
                                    ...baseContent,
                                    type: 'image',
                                    image: content.image,
                                };
                            case 'quiz':
                                return {
                                    ...baseContent,
                                    type: 'quiz',
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


    return (<div>
        {type === "content" ? (<Course course={courseData} />) : (<CourseFrontPage course={courseData} owner={{
            id: 1,
            fullName: "Hubert Ozarowski",
            description: "test",
            badges: [],
            picture: "",
            role: "User",
            achievementsVisible: false
        }}/>)}
    </div>);
};
