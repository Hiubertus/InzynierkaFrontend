import { create } from 'zustand'
import { CourseData } from '@/models/front_models/CourseData'
import useProfileStore from "@/lib/stores/profileStore";
import { ProfileData } from "@/models/front_models/ProfileData";
import {fetchShopCoursesCards} from "@/lib/course/fetchShopCoursesCards";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";
import {useUserStore} from "@/lib/stores/userStore";
import {fetchCreatedCoursesCards} from "@/lib/course/fetchCreatedCoursesCards";
import {useAuthStore} from "@/lib/stores/authStore";
import {fetchOwnedCoursesCards} from "@/lib/course/fetchOwnedCoursesCards";
import {
    CreatedCoursesDataFetched,
    OwnedCoursesDataFetched,
    ShopCoursesDataFetched
} from "@/models/backend_models/CoursesDataFetched";


interface CourseStore {
    courses: CourseData[];

    totalItems: number,
    totalPages: number,
    currentPage: number,

    shopCourses: CourseData[],
    createdCourses: CourseData[],
    ownedCourses: CourseData[],

    isLoading: boolean;
    error: string | null;

    fetchShopCourses: () => Promise<void>;
    fetchOwnedCourses: () => Promise<void>;
    fetchCreatedCourses: () => Promise<void>;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setCourses: (courses: CourseData[]) => void;
}

const useCourseStore = create<CourseStore>((set, get) => ({
    courses: [],

    shopCourses: [],
    createdCourses: [],
    ownedCourses: [],

    totalItems: 0,
    totalPages: 0,
    currentPage: 0,

    isLoading: false,
    error: null,

    fetchShopCourses: async () => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const allData: ShopCoursesDataFetched = await fetchShopCoursesCards();
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().shopCourses;

            if(allData.courses && Array(allData.courses).length === 0) {
                set({isLoading: false, totalItems: 0, totalPages: 0, currentPage: 0})
                return
            }

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

            set({
                // totalItems: allData.totalItems,
                // totalPages: allData.totalPages,
                // currentPage: allData.currentPage,
                shopCourses: updatedCourses,
                courses: updatedCourses
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOwnedCourses: async () => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const authStore = useAuthStore.getState();
            const allData: OwnedCoursesDataFetched = await fetchOwnedCoursesCards(authStore.accessToken!);
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().ownedCourses;

            if(allData.courses && Array(allData.courses).length === 0) {
                set({isLoading: false, totalItems: 0, totalPages: 0, currentPage: 0})
                return
            }

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

            set({
                // totalItems: allData.totalItems,
                // totalPages: allData.totalPages,
                // currentPage: allData.currentPage,
                ownedCourses: updatedCourses,
                courses: updatedCourses
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },

    fetchCreatedCourses: async () => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const userStore = useUserStore.getState();
            const allData: CreatedCoursesDataFetched = await fetchCreatedCoursesCards(userStore.userData!.id);
            const currentCourses = get().createdCourses;

            if(allData.courses && Array(allData.courses).length === 0) {
                set({isLoading: false, totalItems: 0, totalPages: 0, currentPage: 0})
                return
            }

            const newCourses: CourseData[] = [];

            allData.courses.forEach((data) => {
                const courseData = data.courseData;

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

            set({
                totalItems: allData.totalItems,
                totalPages: allData.totalPages,
                currentPage: allData.currentPage,
                createdCourses: updatedCourses,
                courses: updatedCourses
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },


    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setCourses: (courses) => set({ courses }),
}));

export default useCourseStore


