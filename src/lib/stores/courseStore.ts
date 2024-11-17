import { create } from 'zustand'
import { CourseData } from '@/models/front_models/CourseData'
import useProfileStore from "@/lib/stores/profileStore";
import { ProfileData } from "@/models/front_models/ProfileData";
import {fetchCoursesCards} from "@/lib/course/fetchCoursesCards";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";

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
            const allData = await fetchCoursesCards();

            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().courses;

            const newCourses: CourseData[] = [];

            allData.forEach((course) => {
                // Sprawdzanie i dodawanie profilu
                const profileExists = currentProfiles.some(
                    profile => profile.id === course.ownerData.id
                );

                if (!profileExists) {
                    const newProfile: ProfileData = {
                        id: course.ownerData.id,
                        fullName: course.ownerData.fullName,
                        picture: convertPictureToFile(course.ownerData.picture.data, course.ownerData.picture.mimeType),
                        description: course.ownerData.description,
                        badges: course.ownerData.badges,
                        badgesVisible: course.ownerData.badgesVisible,
                        createdAt: course.ownerData.createdAt,
                    };
                    profileStore.addProfile(newProfile);
                }

                // Sprawdzanie i dodawanie kursu
                const courseExists = currentCourses.some(
                    existingCourse => existingCourse.id === course.courseData.id
                );

                if (!courseExists) {
                    const newCourse: CourseData = {
                        id: course.courseData.id,
                        name: course.courseData.name,
                        banner: convertPictureToFile(course.courseData.banner.data, course.courseData.banner.mimeType),
                        price: course.courseData.price,
                        review: course.courseData.review,
                        duration: course.courseData.duration,
                        createdAt: new Date(course.courseData.createdAt),
                        updatedAt: new Date(course.courseData.updatedAt),
                        tags: course.courseData.tags,
                        reviewNumber: course.courseData.reviewNumber,
                        ownerId: course.courseData.ownerId,
                        description: course.courseData.description,
                        chapters: []
                    };
                    newCourses.push(newCourse);
                }
            });

            const updatedCourses = [...currentCourses, ...newCourses];
            set({ courses: updatedCourses });

            return updatedCourses;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania kursów';
            set({ error: null });
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