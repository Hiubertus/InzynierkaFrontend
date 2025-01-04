import { create } from 'zustand'
import {Answer, ChapterData, cMedia, CourseData, cQuiz, cText} from '@/models/front_models/CourseData'
import { useProfileStore } from "@/lib/stores/profileStore";
import { ProfileData } from "@/models/front_models/ProfileData";
import {fetchShopCoursesCards} from "@/lib/course/fetchShopCoursesCards";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";
import {useUserStore} from "@/lib/stores/userStore";
import {fetchCreatedCoursesCards} from "@/lib/course/fetchCreatedCoursesCards";
import {useAuthStore} from "@/lib/stores/authStore";
import {fetchOwnedCoursesCards} from "@/lib/course/fetchOwnedCoursesCards";
import {
    ContentInfo, CourseInfo,
    CreatedCoursesDataFetched,
    OwnedCoursesDataFetched, UserProfileGet,
    ShopCoursesDataFetched
} from "@/models/backend_models/CoursesDataFetched";
import {getCourseFrontData} from "@/lib/course/getCourseFrontData";
import {buyCourse} from "@/lib/course/buyCourse";
import {getCourseSubchapters} from "@/lib/course/getCourseSubchapters";
import {getCourseContents} from "@/lib/course/getCourseContents";
import {getBestCourses} from "@/lib/course/getBestCourses";
import {getTags} from "@/lib/course/getTags";


interface CourseStore {
    courses: CourseData[];

    totalItems: number,
    totalPages: number,
    currentPage: number,

    shopCourses: CourseData[],
    createdCourses: CourseData[],
    ownedCourses: CourseData[],

    availableTags: string[];

    isLoading: boolean;
    error: string | null;

    fetchTags: () => Promise<void>;

    fetchSingleCourse: (courseId: number, accessToken: string | null) => Promise<void>;
    fetchShopCourses: (page?: number, pageSize?: number, search?: string, tag?: string) => Promise<void>;
    fetchOwnedCourses: (page?: number, pageSize?: number, search?: string, tag?: string) => Promise<void>;
    fetchCreatedCourses: (userId?: number, page?: number, pageSize?: number, search?: string, tag?: string) => Promise<void>;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setCourses: (courses: CourseData[]) => void;
    buyCourseAction: (courseId: number) => Promise<void>;
    resetData: () => void;

    fetchSubchaptersForChapter: (chapterId: number) => Promise<void>
    fetchContentForSubchapter: (subchapterId: number) => Promise<void>
    fetchProfileCourses: (profileId: number, page?: number, pageSize?: number, search?: string, tag?: string) => Promise<void>
    resetPage: () => void;

    fetchBestCourses: () => Promise<void>
}

export const useCourseStore = create<CourseStore>((set, get) => ({
    courses: [],

    shopCourses: [],
    createdCourses: [],
    ownedCourses: [],

    availableTags: [],

    totalItems: 0,
    totalPages: 0,
    currentPage: 0,

    isLoading: false,
    error: null,

    fetchTags: async () => {
        try {
            const tags: string[] = await getTags();
            set({ availableTags: tags });
        } catch (error) {
            console.error('Error fetching tags:', error);
            set({ availableTags: [] });
        }
    },

    resetPage: () => {
        set({ currentPage: 0 });
    },

    resetData: () => {
        set({
            courses: [],
            shopCourses: [],
            createdCourses: [],
            ownedCourses: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 0,
            isLoading: false,
            error: null
        });
    },

    fetchBestCourses: async () => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const authStore = useAuthStore.getState();
            const response = await getBestCourses(authStore.accessToken);

            const currentShopCourses = get().shopCourses;
            const currentOwnedCourses = get().ownedCourses;
            const currentCreatedCourses = get().createdCourses;
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;

            const coursesFromResponse = response.courses.map((data: { courseData: CourseInfo, ownerData: UserProfileGet }) => {
                const ownerData = data.ownerData;
                if (!currentProfiles.some(profile => profile.id === ownerData.id)) {
                    profileStore.addProfile({
                        id: ownerData.id,
                        fullName: ownerData.fullName,
                        picture: ownerData.picture ? convertPictureToFile(ownerData.picture.data, ownerData.picture.mimeType) : null,
                        description: ownerData.description,
                        badges: ownerData.badges || [],
                        badgesVisible: ownerData.badgesVisible,
                        createdAt: new Date(ownerData.createdAt),
                        roles: ownerData.roles,
                        review: ownerData.review ? ownerData.review : null,
                        reviewNumber: ownerData.reviewNumber ? ownerData.reviewNumber : null,
                        teacherProfileCreatedAt: ownerData.teacherProfileCreatedAt ? ownerData.teacherProfileCreatedAt : null
                    });
                }

                const courseData = data.courseData;
                return {
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
                    relationshipType: courseData.relationshipType,
                    chapters: []
                };
            });

            coursesFromResponse.forEach((course: CourseData) => {
                switch(course.relationshipType) {
                    case 'PURCHASED': {
                        if (!currentOwnedCourses.some(c => c.id === course.id)) {
                            set({ ownedCourses: [...currentOwnedCourses, course] });
                        }
                        break;
                    }
                    case 'OWNER': {
                        if (!currentCreatedCourses.some(c => c.id === course.id)) {
                            set({ createdCourses: [...currentCreatedCourses, course] });
                        }
                        break;
                    }
                    default: {
                        if (!currentShopCourses.some(c => c.id === course.id)) {
                            set({ shopCourses: [...currentShopCourses, course] });
                        }
                    }
                }
            });

            set({ courses: coursesFromResponse });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch best courses' });
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProfileCourses: async (userId: number, page = 0, pageSize = 9, search?: string, tag?: string) => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const allData: CreatedCoursesDataFetched = await fetchCreatedCoursesCards(userId, page, pageSize, search, tag);

            if (!allData.courses?.length) {
                set({
                    isLoading: false,
                    totalItems: allData.totalItems,
                    totalPages: allData.totalPages,
                    currentPage: allData.currentPage,
                    courses: []
                });
                return;
            }

            const coursesFromResponse: CourseData[] = allData.courses.map(courseData => {
                return {
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
                    relationshipType: courseData.relationshipType,
                    chapters: []
                };
            });

            const currentOwnedCourses = [...get().ownedCourses];
            const currentShopCourses = [...get().shopCourses];
            const currentCreatedCourses = [...get().createdCourses];

            coursesFromResponse.forEach(course => {
                switch (course.relationshipType) {
                    case 'PURCHASED': {
                        const existingIndex = currentOwnedCourses.findIndex(c => c.id === course.id);
                        if (existingIndex === -1) {
                            currentOwnedCourses.push(course);
                        } else {
                            // Zachowaj rozdziały jeśli istnieją
                            if (currentOwnedCourses[existingIndex].chapters.length > 0) {
                                course.chapters = currentOwnedCourses[existingIndex].chapters;
                            }
                            currentOwnedCourses[existingIndex] = course;
                        }
                        break;
                    }
                    case 'OWNER': {
                        const existingIndex = currentCreatedCourses.findIndex(c => c.id === course.id);
                        if (existingIndex === -1) {
                            currentCreatedCourses.push(course);
                        } else {
                            if (currentCreatedCourses[existingIndex].chapters.length > 0) {
                                course.chapters = currentCreatedCourses[existingIndex].chapters;
                            }
                            currentCreatedCourses[existingIndex] = course;
                        }
                        break;
                    }
                    case 'AVAILABLE': {
                        const existingIndex = currentShopCourses.findIndex(c => c.id === course.id);
                        if (existingIndex === -1) {
                            currentShopCourses.push(course);
                        } else {
                            if (currentShopCourses[existingIndex].chapters.length > 0) {
                                course.chapters = currentShopCourses[existingIndex].chapters;
                            }
                            currentShopCourses[existingIndex] = course;
                        }
                        break;
                    }
                }
            });

            set({
                totalItems: allData.totalItems,
                totalPages: allData.totalPages,
                currentPage: allData.currentPage,
                ownedCourses: currentOwnedCourses,
                shopCourses: currentShopCourses,
                createdCourses: currentCreatedCourses,
                courses: coursesFromResponse
            });

        } catch(error) {
            set({ error: null });
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchShopCourses: async (page?: number, pageSize?: number, search?: string, tag?: string) => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const authStore = useAuthStore.getState();
            const allData: ShopCoursesDataFetched = await fetchShopCoursesCards(authStore.accessToken, page, pageSize, search, tag);
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().shopCourses;

            if (!allData.courses?.length) {
                set({
                    isLoading: false,
                    totalItems: allData.totalItems,
                    totalPages: allData.totalPages,
                    currentPage: allData.currentPage,
                    courses: []
                })
                return
            }

            const coursesFromResponse: CourseData[] = allData.courses.map(data => {
                const ownerData = data.ownerData;
                const courseData = data.courseData;

                if (!currentProfiles.some(profile => profile.id === ownerData.id)) {
                    profileStore.addProfile({
                        id: ownerData.id,
                        fullName: ownerData.fullName,
                        picture: ownerData.picture ? convertPictureToFile(ownerData.picture.data, ownerData.picture.mimeType) : null,
                        description: ownerData.description,
                        badges: ownerData.badges || [],
                        badgesVisible: ownerData.badgesVisible,
                        createdAt: new Date(ownerData.createdAt),
                        roles: ownerData.roles,
                        review: ownerData.review ? ownerData.review : null,
                        reviewNumber: ownerData.reviewNumber ? ownerData.reviewNumber : null,
                        teacherProfileCreatedAt: ownerData.teacherProfileCreatedAt ? ownerData.teacherProfileCreatedAt : null
                    });
                }

                return {
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
                    relationshipType: null,
                    chapters: []
                };
            });

            const updatedShopCourses = [...currentCourses];
            coursesFromResponse.forEach(newCourse => {
                const existingIndex = updatedShopCourses.findIndex(c => c.id === newCourse.id);
                if (existingIndex === -1) {
                    updatedShopCourses.push(newCourse);
                }
            });

            set({
                totalItems: allData.totalItems,
                totalPages: allData.totalPages,
                currentPage: allData.currentPage,
                shopCourses: updatedShopCourses,
                courses: coursesFromResponse
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOwnedCourses: async (page = 0, pageSize = 9, search?: string, tag?: string) => {
        set({ isLoading: true, error: null });
        try {
            const authStore = useAuthStore.getState();
            const allData: OwnedCoursesDataFetched = await fetchOwnedCoursesCards(authStore.accessToken!, page, pageSize, search, tag);
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().ownedCourses;

            if (!allData.courses?.length) {
                set({
                    isLoading: false,
                    totalItems: allData.totalItems,
                    totalPages: allData.totalPages,
                    currentPage: allData.currentPage,
                    courses: []
                })
                return
            }

            const coursesFromResponse = allData.courses.map(data => {
                const ownerData = data.ownerData;
                const courseData = data.courseData;

                if (!currentProfiles.some(profile => profile.id === ownerData.id)) {
                    const newProfile: ProfileData = {
                        id: ownerData.id,
                        fullName: ownerData.fullName,
                        picture: ownerData.picture ? convertPictureToFile(ownerData.picture.data, ownerData.picture.mimeType) : null,
                        description: ownerData.description,
                        badges: ownerData.badges || [],
                        badgesVisible: ownerData.badgesVisible,
                        createdAt: new Date(ownerData.createdAt),
                        roles: ownerData.roles,
                        review: ownerData.review ? ownerData.review : null,
                        reviewNumber: ownerData.reviewNumber ? ownerData.reviewNumber : null,
                        teacherProfileCreatedAt: ownerData.teacherProfileCreatedAt ? ownerData.teacherProfileCreatedAt : null
                    };
                    profileStore.addProfile(newProfile);
                }

                return {
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
                    relationshipType: null,
                    chapters: []
                };
            });

            const updatedOwnedCourses = [...currentCourses];
            coursesFromResponse.forEach(newCourse => {
                const existingIndex = updatedOwnedCourses.findIndex(c => c.id === newCourse.id);
                if (existingIndex === -1) {
                    updatedOwnedCourses.push(newCourse);
                }
            });

            set({
                totalItems: allData.totalItems,
                totalPages: allData.totalPages,
                currentPage: allData.currentPage,
                ownedCourses: updatedOwnedCourses,
                courses: coursesFromResponse
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },

    fetchCreatedCourses: async (userId?: number, page = 0, pageSize = 9, search?: string, tag?: string) => {
        set({ isLoading: true, error: null });
        try {
            const userStore = useUserStore.getState();
            const targetUserId = userId || userStore.userData!.id;
            const allData: CreatedCoursesDataFetched = await fetchCreatedCoursesCards(targetUserId, page, pageSize, search, tag);
            const currentCourses = get().createdCourses;

            if (!allData.courses?.length) {
                set({
                    isLoading: false,
                    totalItems: allData.totalItems,
                    totalPages: allData.totalPages,
                    currentPage: allData.currentPage,
                    courses: []
                })
                return
            }

            const coursesFromResponse = allData.courses.map(courseData => ({
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
                relationshipType: null,
                chapters: []
            }));

            const updatedCreatedCourses = [...currentCourses];
            coursesFromResponse.forEach(newCourse => {
                const existingIndex = updatedCreatedCourses.findIndex(c => c.id === newCourse.id);
                if (existingIndex === -1) {
                    updatedCreatedCourses.push(newCourse);
                }
            });

            set({
                totalItems: allData.totalItems,
                totalPages: allData.totalPages,
                currentPage: allData.currentPage,
                createdCourses: updatedCreatedCourses,
                courses: coursesFromResponse
            });

        } catch(error) {
            set({ error: null });
            console.error(error)
        } finally {
            set({ isLoading: false });
        }
    },


    fetchSingleCourse: async (courseId: number, accessToken: string | null) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getCourseFrontData(courseId, accessToken);
            const { courseData, ownerData } = response.courseDetails;

            const profileStore = useProfileStore.getState();
            if (!profileStore.profiles.some(profile => profile.id === ownerData.id)) {
                profileStore.addProfile({
                    id: ownerData.id,
                    fullName: ownerData.fullName,
                    picture: ownerData.picture ? convertPictureToFile(ownerData.picture.data, ownerData.picture.mimeType) : null,
                    description: ownerData.description,
                    badges: ownerData.badges || [],
                    badgesVisible: ownerData.badgesVisible,
                    createdAt: new Date(ownerData.createdAt),
                    roles: ownerData.roles,
                    review: ownerData.review ? ownerData.review : null,
                    reviewNumber: ownerData.reviewNumber ? ownerData.reviewNumber : null,
                    teacherProfileCreatedAt: ownerData.teacherProfileCreatedAt ? ownerData.teacherProfileCreatedAt : null
                });
            }

            const newCourse: CourseData = {
                id: courseData.id,
                name: courseData.name,
                banner: courseData.banner ? convertPictureToFile(courseData.banner.data, courseData.banner.mimeType) : null,
                mimeType: courseData.banner?.mimeType || '',
                price: courseData.price,
                review: courseData.review,
                duration: courseData.duration,
                createdAt: new Date(courseData.createdAt),
                updatedAt: new Date(courseData.updatedAt),
                tags: courseData.tags,
                reviewNumber: courseData.reviewNumber,
                ownerId: courseData.ownerId,
                description: courseData.description,
                relationshipType: courseData.relationshipType,
                chapters: courseData.chaptersShortInfo?.map((chapter: ChapterData) => ({
                    id: chapter.id,
                    order: chapter.order,
                    name: chapter.name,

                    subchapters: []
                })) || []
            };


            let coursesList: CourseData[];
            let coursesKey: 'shopCourses' | 'ownedCourses' | 'createdCourses';

            switch(courseData.relationshipType) {
                case 'PURCHASED':
                    coursesList = get().ownedCourses;
                    coursesKey = 'ownedCourses';
                    break;
                case 'CREATED':
                    coursesList = get().createdCourses;
                    coursesKey = 'createdCourses';
                    break;
                case 'AVAIABLE':
                    coursesList = get().shopCourses;
                    coursesKey = 'createdCourses';
                    break;
                default:
                    coursesList = get().shopCourses;
                    coursesKey = 'shopCourses';
            }

            const existingCourseIndex = coursesList.findIndex(c => c.id === newCourse.id);
            if (existingCourseIndex !== -1) {

                const existingCourse = coursesList[existingCourseIndex];
                if (existingCourse.chapters.some(chapter => chapter.subchapters.length > 0)) {
                    newCourse.chapters = existingCourse.chapters;
                }

                const updatedCourses = [...coursesList];
                updatedCourses[existingCourseIndex] = newCourse;
                set({ [coursesKey]: updatedCourses });
            } else {

                set({ [coursesKey]: [...coursesList, newCourse] });
            }

            const currentCourses = get().courses;
            const mainCourseIndex = currentCourses.findIndex(c => c.id === newCourse.id);

            if (mainCourseIndex === -1) {
                set({ courses: [...currentCourses, newCourse] });
            } else {
                const updatedCourses = [...currentCourses];
                updatedCourses[mainCourseIndex] = newCourse;
                set({ courses: updatedCourses });
            }

        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania kursu' });
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },
    buyCourseAction: async (courseId: number) => {
        const authStore = useAuthStore.getState();
        const userStore = useUserStore.getState();

        if (!authStore.accessToken) {
            throw new Error('Please log in to purchase this course');
        }

        try {
            set({ isLoading: true });

            await buyCourse(courseId, authStore.accessToken);

            await get().fetchSingleCourse(courseId, authStore.accessToken);

            const course = get().courses.find(c => c.id === courseId);
            if (course && userStore.userData) {

                set({
                    shopCourses: get().shopCourses.filter(c => c.id !== courseId),
                    ownedCourses: [...get().ownedCourses, course]
                });

                userStore.updateUserField('points', userStore.userData.points - course.price);
            }

        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to purchase course');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSubchaptersForChapter: async (chapterId: number): Promise<void> => {
        const authStore = useAuthStore.getState()
        if (!authStore.accessToken) return

        set({ isLoading: true })
        try {
            const response = await getCourseSubchapters(chapterId, authStore.accessToken)
            const chapterData = response.chapter

            const updatedOwnedCourses = get().ownedCourses.map(course => ({
                ...course,
                chapters: course.chapters.map(chapter => {
                    if (chapter.id === chapterId) {
                        return {
                            ...chapter,
                            subchapters: chapterData.subchapters || []
                        }
                    }
                    return chapter
                })
            }))

            set({
                ownedCourses: updatedOwnedCourses,
                courses: updatedOwnedCourses
            })

            const courseWithChapter = updatedOwnedCourses.find(c =>
                c.chapters.some(ch => ch.id === chapterId)
            )
            const chapter = courseWithChapter?.chapters.find(ch =>
                ch.id === chapterId
            )

            if (chapter && chapter.subchapters.length > 0) {
                const firstSubchapter = chapter.subchapters[0]
                await get().fetchContentForSubchapter(firstSubchapter.id)
            }
        } catch (error) {
            console.error('Error loading subchapters:', error)
            set({ error: 'Failed to load subchapters' })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchContentForSubchapter: async (subchapterId: number) => {
        const authStore = useAuthStore.getState()
        if (!authStore.accessToken) return

        set({ isLoading: true })
        try {
            const response = await getCourseContents(subchapterId, authStore.accessToken)
            const rawContents = response.subchapter.content
            const processedContents = rawContents.map((content: ContentInfo) => {
                switch (content.type) {
                    case 'text':
                        return {
                            id: content.id,
                            type: 'text',
                            text: content.text,
                            order: content.order,
                            fontSize: content.fontSize,
                            bolder: content.bolder,
                            italics: content.italics,
                            underline: content.underline,
                            textColor: content.textColor
                        } as cText

                    case 'image':
                    case 'video':
                        return {
                            id: content.id,
                            type: content.type,
                            order: content.order,
                            file:  convertPictureToFile(content.file.data, content.file.mimeType),
                            mimeType: content.file.mimeType
                        } as cMedia

                    case 'quiz':
                        return {
                            id: content.id,
                            type: 'quiz',
                            order: content.order,
                            quizContent: content.quizContent.map(quiz => ({
                                id: quiz.id,
                                question: quiz.question,
                                order: quiz.order,
                                singleAnswer: quiz.singleAnswer,
                                answers: quiz.answers.map((answer: Answer) => ({
                                    id: answer.id,
                                    order: answer.order,
                                    answer: answer.answer,
                                    isCorrect: answer.isCorrect
                                }))
                            }))
                        } as cQuiz

                    default:
                        throw new Error(`Unknown content type`)
                }
            })

            const updatedOwnedCourses = get().ownedCourses.map(course => ({
                ...course,
                chapters: course.chapters.map(chapter => ({
                    ...chapter,
                    subchapters: chapter.subchapters.map(subchapter => {
                        if (subchapter.id === subchapterId) {
                            return {
                                ...subchapter,
                                content: processedContents
                            }
                        }
                        return subchapter
                    })
                }))
            }))

            set({
                ownedCourses: updatedOwnedCourses,
                courses: updatedOwnedCourses
            })
        } catch (error) {
            console.error('Error loading content:', error)
            set({ error: 'Failed to load content' })
        } finally {
            set({ isLoading: false })
        }
    },

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setCourses: (courses) => set({ courses }),
}));


