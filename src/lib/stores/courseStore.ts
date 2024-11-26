import { create } from 'zustand'
import {Answer, ChapterData, cMedia, CourseData, cQuiz, cText, QuizForm} from '@/models/front_models/CourseData'
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
import {getCourseFrontData} from "@/lib/course/getCourseFrontData";
import {buyCourse} from "@/lib/course/buyCourse";
import {getCourseSubchapters} from "@/lib/course/getCourseSubchapters";
import {getCourseContents} from "@/lib/course/getCourseContents";


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

    fetchSingleCourse: (courseId: number, accessToken: string | null) => Promise<void>;
    fetchShopCourses: () => Promise<void>;
    fetchOwnedCourses: () => Promise<void>;
    fetchCreatedCourses: () => Promise<void>;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setCourses: (courses: CourseData[]) => void;
    buyCourseAction: (courseId: number) => Promise<void>;
    resetData: () => void;

    fetchSubchaptersForChapter: (chapterId: number) => Promise<void>
    fetchContentForSubchapter: (subchapterId: number) => Promise<void>

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

    fetchShopCourses: async () => {
        set({ isLoading: true, error: null, courses: [] });
        try {
            const authStore = useAuthStore.getState();
            const allData: ShopCoursesDataFetched = await fetchShopCoursesCards(authStore.accessToken);
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const currentCourses = get().shopCourses;

            if (!allData.courses?.length) {
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
                        badges: ownerData.badges || [],
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
                        relationshipType: null,
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

            if (!allData.courses?.length) {
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
                        badges: ownerData.badges || [],
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
                        relationshipType: null,
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

            if (!allData.userCourses?.length) {
                set({isLoading: false, totalItems: 0, totalPages: 0, currentPage: 0})
                return
            }

            const newCourses: CourseData[] = [];

            allData.userCourses.forEach((courseData) => {

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
                        relationshipType: null,
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
    fetchSingleCourse: async (courseId: number, accessToken: string | null) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getCourseFrontData(courseId, accessToken);
            const { courseData, ownerData } = response.courseDetails;

            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;

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
                    review: chapter.review,
                    reviewNumber: chapter.reviewNumber,
                    subchapters: []
                })) || []
            };


            const currentCourses = get().courses;
            const courseIndex = currentCourses.findIndex(c => c.id === newCourse.id);

            if (courseIndex === -1) {
                set({ courses: [...currentCourses, newCourse] });
            } else {
                const updatedCourses = [...currentCourses];
                updatedCourses[courseIndex] = newCourse;
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
        if (!authStore.accessToken) {
            throw new Error('Please log in to purchase this course');
        }

        try {
            set({ isLoading: true });

            await buyCourse(courseId, authStore.accessToken);

            await get().fetchSingleCourse(courseId, authStore.accessToken);

            const course = get().courses.find(c => c.id === courseId);
            if (course) {
                set({
                    shopCourses: get().shopCourses.filter(c => c.id !== courseId),
                    ownedCourses: [...get().ownedCourses, course]
                });
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

            const updatedCourses = get().courses.map(course => ({
                ...course,
                chapters: course.chapters.map(chapter => {
                    if (chapter.id === chapterId) {
                        return {
                            ...chapter,
                            subchapters: chapterData.subchapters || [] // Używamy właściwej ścieżki
                        }
                    }
                    return chapter
                })
            }))

            set({ courses: updatedCourses })

            const courseWithChapter = updatedCourses.find(c =>
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
            const processedContents = rawContents.map((content: (cText | cMedia | cQuiz)) => {
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
                            quizContent: content.quizContent.map((quiz: QuizForm) => ({
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

            const courses = get().courses.map(course => ({
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

            set({ courses })
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

export default useCourseStore


