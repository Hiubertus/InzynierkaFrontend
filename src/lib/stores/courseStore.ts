import { create } from 'zustand'
import { CourseData } from '@/models/CourseData'
import { ProfileData } from '@/models/ProfileData'

interface CourseWithAuthor extends CourseData {
    author: ProfileData;
}

interface CourseStore {

    courses: CourseWithAuthor[];
    isLoading: boolean;
    error: string | null;

    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

}

const useCourseStore = create<CourseStore>((set) => ({

    courses: [],
    isLoading: false,
    error: null,

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

}))

export default useCourseStore
