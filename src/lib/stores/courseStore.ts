import { create } from 'zustand';
import {CourseData} from "@/models/CourseData";

interface CourseStore {

    courses: CourseData[];

    currentCourse: number | null;
    currentChapter: number | null;
    currentSubChapter: number | null;

    setCurrentCourse: (courseId: number) => void;
    setCurrentChapter: (chapterId: number) => void;
    setCurrentSubChapter: (subChapterId: number) => void;

    setSubChapterCompletion: (subChapterId: number) => void;
    setQuizAnswer: (quizAnswerId: number) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
    courses: [],
    currentCourse: null,
    currentChapter: null,
    currentSubChapter: null,


}))