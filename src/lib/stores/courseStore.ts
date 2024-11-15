import { create } from 'zustand'
import { CourseData } from '@/models/CourseData'
import axios from 'axios'
import useProfileStore from "@/lib/stores/profileStore";
import { ProfileData } from "@/models/ProfileData";

interface CourseStore {
    courses: CourseData[];
    isLoading: boolean;
    error: string | null;

    fetchCourses: () => Promise<CourseData[]>;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setCourses: (courses: CourseData[]) => void;
}

const useCourseStore = create<CourseStore>((set, get) => ({
    courses: [],
    isLoading: false,
    error: null,

    fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log("kek")
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/get`
            );

            const allData = response.data.data.courses;


            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().courses;

            const newCourses: CourseData[] = [];
            console.log("still good")
            allData.forEach((course: { courseData: CourseData, ownerData: ProfileData }) => {

                const profileExists = currentProfiles.some(
                    profile => profile.id === course.ownerData.id
                );
                console.log("awww dang it")
                if (!profileExists) {
                    profileStore.addProfile(course.ownerData);
                }

                const courseExists = currentCourses.some(
                    existingCourse => existingCourse.id === course.courseData.id
                );
                console.log("awww dang it kek")
                if (!courseExists) {
                    newCourses.push(course.courseData);
                }
            });

            const updatedCourses = [...currentCourses, ...newCourses];
            set({ courses: updatedCourses });

            return updatedCourses;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania kursów';
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setCourses: (courses) => set({ courses })
}));

export default useCourseStore