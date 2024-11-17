import { create } from 'zustand'
import { CourseData } from '@/models/front_models/CourseData'
import useProfileStore from "@/lib/stores/profileStore";
import { ProfileData } from "@/models/front_models/ProfileData";
import {fetchCoursesCards} from "@/lib/course/fetchCoursesCards";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";
import {CoursesDataFetched} from "@/models/backend_models/CoursesDataFetched";

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
            const allData: CoursesDataFetched = await fetchCoursesCards();

            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().courses;

            const newCourses: CourseData[] = [];

            allData.courses.forEach((data) => {

                const ownerData = data.ownerData;
                const courseData = data.courseData;
                const profileExists = currentProfiles.some(
                    profile => profile.id === ownerData.id
                );

                if (!profileExists) {
                    const newProfile: ProfileData = {
                        id: ownerData.id,
                        fullName: ownerData.fullName,
                        picture: convertPictureToFile(ownerData.picture.data, ownerData.picture.mimeType),
                        description: ownerData.description,
                        badges: ownerData.badges,
                        badgesVisible: ownerData.badgesVisible,
                        createdAt: new Date(ownerData.createdAt),
                    };
                    profileStore.addProfile(newProfile);
                }

                const courseExists = currentCourses.some(
                    existingCourse => existingCourse.id === courseData.id
                );

                if (!courseExists) {
                    const newCourse: CourseData = {
                        id: courseData.id,
                        name: courseData.name,
                        banner: convertPictureToFile(courseData.banner.data, courseData.banner.mimeType),
                        mimeType: courseData.banner.mimeType,
                        price: courseData.price,
                        review: courseData.review,
                        duration: courseData.duration,
                        createdAt: new Date(courseData.createdAt),
                        updatedAt: new Date(courseData.updatedAt),
                        tags: courseData.tags,
                        reviewNumber: courseData.reviewNumber,
                        ownerId: courseData.ownerId,
                        description: courseData.description,
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