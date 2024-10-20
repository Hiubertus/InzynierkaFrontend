import { create } from 'zustand';
import axios from 'axios';
import {
    CourseData,
    ChapterData,
    SubChapterData,
    SubChapterPage,
    Answer,
    cQuiz
} from '@/models/CourseData';

interface CourseStore {
    courses: CourseData[];

    fetchCourses: () => Promise<void>;
    fetchCourseDetails: (courseId: number) => Promise<void>;
    fetchChapterDetails: (courseId: number, chapterId: number) => Promise<void>;
    fetchSubChapterContent: (courseId: number, chapterId: number, subChapterId: number) => Promise<void>;

    toggleSubChapterCompletion: (courseId: number, chapterId: number, subChapterId: number) => Promise<void>;
    setQuizAnswer: (courseId: number, chapterId: number, subChapterId: number, pageId: number, quizId: number, answerId: number, isSelected: boolean) => Promise<void>;
}

const API_BASE_URL = 'https://api.example.com'; // Zastąp właściwym URL API

export const useCourseStore = create<CourseStore>()((set, get) => ({
    courses: [],

    fetchCourses: async () => {
        const response = await axios.get<CourseData[]>(`${API_BASE_URL}/courses`);
        set({ courses: response.data });
    },

    fetchCourseDetails: async (courseId: number) => {
        const response = await axios.get<CourseData>(`${API_BASE_URL}/courses/${courseId}`);
        set(state => ({
            courses: state.courses.map(course =>
                course.id === courseId ? { ...course, ...response.data } : course
            )
        }));
    },

    fetchChapterDetails: async (courseId: number, chapterId: number) => {
        const response = await axios.get<ChapterData>(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}`);
        set(state => ({
            courses: state.courses.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        chapters: course.chapters
                            ? course.chapters.map(chapter =>
                                chapter.id === chapterId ? { ...chapter, ...response.data } : chapter
                            )
                            : [response.data]
                    }
                    : course
            )
        }));
    },

    fetchSubChapterContent: async (courseId: number, chapterId: number, subChapterId: number) => {
        const response = await axios.get<SubChapterPage[]>(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/subchapters/${subChapterId}/content`);
        set(state => ({
            courses: state.courses.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        chapters: course.chapters?.map(chapter =>
                            chapter.id === chapterId
                                ? {
                                    ...chapter,
                                    subchapters: chapter.subchapters?.map(subchapter =>
                                        subchapter.id === subChapterId
                                            ? { ...subchapter, content: response.data }
                                            : subchapter
                                    )
                                }
                                : chapter
                        )
                    }
                    : course
            )
        }));
    },

    toggleSubChapterCompletion: async (courseId: number, chapterId: number, subChapterId: number) => {
        const course = get().courses.find(c => c.id === courseId);
        const chapter = course?.chapters?.find(ch => ch.id === chapterId);
        const subChapter = chapter?.subchapters?.find(sc => sc.id === subChapterId);

        if (!subChapter) return;

        const updatedSubChapter: SubChapterData = {
            ...subChapter,
            completed: !subChapter.completed
        };

        // Wyślij aktualizację na serwer
        await axios.patch(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/subchapters/${subChapterId}`, {
            completed: updatedSubChapter.completed
        });

        // Zaktualizuj stan lokalny
        set(state => ({
            courses: state.courses.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        chapters: course.chapters?.map(chapter =>
                            chapter.id === chapterId
                                ? {
                                    ...chapter,
                                    subchapters: chapter.subchapters?.map(sc =>
                                        sc.id === subChapterId ? updatedSubChapter : sc
                                    )
                                }
                                : chapter
                        )
                    }
                    : course
            )
        }));
    },

    setQuizAnswer: async (courseId: number, chapterId: number, subChapterId: number, pageId: number, quizId: number, answerId: number, isSelected: boolean) => {
        const course = get().courses.find(c => c.id === courseId);
        const chapter = course?.chapters?.find(ch => ch.id === chapterId);
        const subChapter = chapter?.subchapters?.find(sc => sc.id === subChapterId);
        const page = subChapter?.content?.find(p => p.id === pageId);
        const quiz = page?.content.find(item => item.type === 'quiz' && item.id === quizId) as cQuiz | undefined;
        const quizForm = quiz?.quizContent.find(qf => qf.id === quizId);

        if (!quizForm) return;

        let updatedAnswers: Answer[];

        if (quizForm.singleAnswer) {
            updatedAnswers = quizForm.answers.map(answer => ({
                ...answer,
                isCorrect: answer.id === answerId
            }));
        } else {
            updatedAnswers = quizForm.answers.map(answer =>
                answer.id === answerId ? { ...answer, isCorrect: isSelected } : answer
            );
        }

        // Wyślij aktualizację na serwer
        await axios.post(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/subchapters/${subChapterId}/pages/${pageId}/quizzes/${quizId}/answers`, updatedAnswers);

        // Zaktualizuj stan lokalny
        set(state => ({
            courses: state.courses.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        chapters: course.chapters?.map(chapter =>
                            chapter.id === chapterId
                                ? {
                                    ...chapter,
                                    subchapters: chapter.subchapters?.map(subchapter =>
                                        subchapter.id === subChapterId
                                            ? {
                                                ...subchapter,
                                                content: subchapter.content?.map(p =>
                                                    p.id === pageId
                                                        ? {
                                                            ...p,
                                                            content: p.content.map(item =>
                                                                item.type === 'quiz' && item.id === quizId
                                                                    ? {
                                                                        ...item,
                                                                        quizContent: item.quizContent.map(qf =>
                                                                            qf.id === quizId
                                                                                ? { ...qf, answers: updatedAnswers }
                                                                                : qf
                                                                        )
                                                                    }
                                                                    : item
                                                            )
                                                        }
                                                        : p
                                                )
                                            }
                                            : subchapter
                                    )
                                }
                                : chapter
                        )
                    }
                    : course
            )
        }));
    }
}))