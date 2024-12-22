import { create } from 'zustand';
import { Review } from "@/models/front_models/Review";
import { useProfileStore } from './profileStore'
import {getCoursesReviews} from "@/lib/review/getCourseReviews";
import {getOwnCourseReview} from "@/lib/review/getOwnCourseReview";
import {addCourseReview} from "@/lib/review/addCourseReview";
import {useUserStore} from "@/lib/stores/userStore";
import {useAuthStore} from "@/lib/stores/authStore";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";
import { useCourseStore }from "@/lib/stores/courseStore";
import {editReview} from "@/lib/review/editReview";
import {deleteReview} from "@/lib/review/deleteReview";
import {ReviewDataGet} from "@/models/backend_models/ReviewDataGet";

interface ReviewState {
    reviews: Review[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    sortDir: 'asc' | 'desc';
    sortBy: 'date' | 'rating';

    fetchCourseReviews: (id: number, page?: number, size?: number) => Promise<Review[]>;
    addCourseReview: (id: number, rating: number, content: string) => Promise<void>;
    setSortDirection: (direction: 'asc' | 'desc', courseId: number) => Promise<void>;
    setSortBy: (sort: 'date' | 'rating', courseId: number) => Promise<void>;
    editReview: (reviewId: number, rating: number, content: string) => Promise<void>;
    deleteReview: (reviewId: number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
    reviews: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    sortDir: 'desc',
    sortBy: 'date',

    fetchCourseReviews: async (id: number, page?: number, size?: number) => {
        try {
            const authStore = useAuthStore.getState()
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles
            const ownerData = useUserStore.getState()
            const courseStore = useCourseStore.getState();

            const response = await getCoursesReviews(
                id,
                page ?? get().currentPage,
                size || 3,
                get().sortDir,
                get().sortBy,
                authStore.accessToken
            );

            const processedReviews = response.reviews.map((review: ReviewDataGet) => {
                const processedProfile = {
                    id: review.userProfile.id,
                    fullName: review.userProfile.fullName,
                    picture: convertPictureToFile(review.userProfile.picture.data, review.userProfile.picture.mimeType),
                    description: review.userProfile.description,
                    badges: review.userProfile.badges || [],
                    badgesVisible: review.userProfile.badgesVisible,
                    createdAt: new Date(review.userProfile.createdAt),
                    roles: review.userProfile.roles,
                    review: review.userProfile.review ? review.userProfile.review : null,
                    reviewNumber: review.userProfile.reviewNumber ? review.userProfile.reviewNumber : null,
                    teacherProfileCreatedAt: review.userProfile.teacherProfileCreatedAt ? review.userProfile.teacherProfileCreatedAt : null
                };

                if (!currentProfiles.some(profile => profile.id === ownerData.userData?.id)) {
                    profileStore.addProfile(processedProfile);
                }

                return {
                    ...review,
                    userProfile: processedProfile,
                    type: 'course' as const,
                    contentId: id
                };
            });

            const hasOwnReview = ownerData.userData ? processedReviews.some(
                (review: Review) => review.userProfile.id === ownerData.userData?.id
            ) : false;

            const course = courseStore.ownedCourses.find(course => course.id === id);
            if (authStore.accessToken &&
                course?.relationshipType === 'PURCHASED' &&
                !hasOwnReview) {
                try {
                    const ownReviewResponse = await getOwnCourseReview(id, authStore.accessToken);
                    const ownReview = ownReviewResponse.review
                    if (ownReviewResponse) {
                        const currentUserProfile = currentProfiles.find(
                            profile => profile.id === ownerData.userData?.id
                        );
                        if (currentUserProfile) {
                            processedReviews.unshift({
                                ...ownReview,
                                userProfile: currentUserProfile,
                                type: 'course' as const,
                                contentId: id
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error fetching own review:', error);
                }
            }

            set({
                reviews: processedReviews,
                totalItems: response.totalItems,
                totalPages: response.totalPages,
                currentPage: response.currentPage
            });

            return processedReviews;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    addCourseReview: async (id: number, rating: number, content: string) => {
        try {
            const authStore = useAuthStore.getState();
            const courseStore = useCourseStore.getState();
            const course = courseStore.ownedCourses.find(course => course.id === id);

            if (!authStore.accessToken || course?.relationshipType !== 'PURCHASED') {
                throw new Error('Unauthorized to add review');
            }

            await addCourseReview(id, rating, content, authStore.accessToken);
            await get().fetchCourseReviews(id, get().currentPage);
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    setSortDirection: async (direction: 'asc' | 'desc', courseId: number) => {
        set({ sortDir: direction, currentPage: 0 });
        await get().fetchCourseReviews(courseId, 0);
    },

    setSortBy: async (sort: 'date' | 'rating', courseId: number) => {
        set({ sortBy: sort, currentPage: 0 });
        await get().fetchCourseReviews(courseId, 0);
    },

    editReview: async (reviewId: number, rating: number, content: string) => {
        try {
            const authStore = useAuthStore.getState();

            if (!authStore.accessToken) {
                throw new Error('Unauthorized to edit review');
            }

            await editReview(reviewId, rating, content, authStore.accessToken);

            const currentReview = get().reviews.find(review => review.id === reviewId);
            if (currentReview) {
                await get().fetchCourseReviews(currentReview.contentId, get().currentPage);
            }
        } catch (error) {
            console.error('Error editing review:', error);
            throw error;
        }
    },

    deleteReview: async (reviewId: number) => {
        try {
            const authStore = useAuthStore.getState();

            if (!authStore.accessToken) {
                throw new Error('Unauthorized to delete review');
            }

            const currentReview = get().reviews.find(review => review.id === reviewId);
            const contentId = currentReview?.contentId;

            await deleteReview(reviewId, authStore.accessToken);

            if (contentId) {
                try {
                    await get().fetchCourseReviews(contentId, get().currentPage);
                } catch  {
                    set(state => ({
                        ...state,
                        reviews: state.reviews.filter(review => review.id !== reviewId)
                    }));
                }
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}));