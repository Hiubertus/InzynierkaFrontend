import { create } from 'zustand';
import { Review } from "@/models/front_models/Review";
import { useProfileStore } from './profileStore'
import { getCoursesReviews } from "@/lib/review/getCourseReviews";
import { getOwnCourseReview } from "@/lib/review/getOwnCourseReview";
import { addCourseReview } from "@/lib/review/addCourseReview";
import { getTeacherReviews } from "@/lib/review/getTeacherReview";
import { getOwnTeacherReview } from "@/lib/review/getOwnTeacherReview";
import { addTeacherReview } from "@/lib/review/addTeacherReview";
import { useUserStore } from "@/lib/stores/userStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { convertPictureToFile } from "@/lib/utils/conversionFunction";
import { useCourseStore } from "@/lib/stores/courseStore";
import { editReview } from "@/lib/review/editReview";
import { deleteReview } from "@/lib/review/deleteReview";
import { ReviewDataGet } from "@/models/backend_models/ReviewDataGet";

interface ReviewState {
    reviews: Review[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    sortDir: 'asc' | 'desc';
    sortBy: 'date' | 'rating';

    fetchReviews: (type: 'course' | 'teacher', id: number, page?: number, size?: number) => Promise<Review[]>;
    addReview: (type: 'course' | 'teacher', id: number, rating: number, content: string) => Promise<void>;
    setSortDirection: (direction: 'asc' | 'desc', id: number, type: 'course' | 'teacher') => Promise<void>;
    setSortBy: (sort: 'date' | 'rating', id: number, type: 'course' | 'teacher') => Promise<void>;
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

    fetchReviews: async (type: 'course' | 'teacher', id: number, page?: number, size?: number) => {
        try {
            const authStore = useAuthStore.getState();
            const profileStore = useProfileStore.getState();
            const currentProfiles = profileStore.profiles;
            const ownerData = useUserStore.getState();

            const response = type === 'course'
                ? await getCoursesReviews(id, page ?? get().currentPage, size || 3, get().sortDir, get().sortBy, authStore.accessToken)
                : await getTeacherReviews(id, page ?? get().currentPage, size || 3, get().sortDir, get().sortBy, authStore.accessToken);

            const processedReviews = response.reviews.map((review: ReviewDataGet) => {
                const processedProfile = {
                    id: review.userProfile.id,
                    fullName: review.userProfile.fullName,
                    picture: review.userProfile.picture ? convertPictureToFile(review.userProfile.picture.data, review.userProfile.picture.mimeType) : null,
                    description: review.userProfile.description,
                    badges: review.userProfile.badges || [],
                    badgesVisible: review.userProfile.badgesVisible,
                    createdAt: new Date(review.userProfile.createdAt),
                    roles: review.userProfile.roles,
                    review: review.userProfile.review ? review.userProfile.review : null,
                    reviewNumber: review.userProfile.reviewNumber ? review.userProfile.reviewNumber : null,
                    teacherProfileCreatedAt: review.userProfile.teacherProfileCreatedAt
                        ? new Date(review.userProfile.teacherProfileCreatedAt)
                        : null
                };

                if (!currentProfiles.some(profile => profile.id === ownerData.userData?.id)) {
                    profileStore.addProfile(processedProfile);
                }

                return {
                    ...review,
                    userProfile: processedProfile,
                    type: type,
                    contentId: id
                };
            });

            const hasOwnReview = ownerData.userData ? processedReviews.some(
                (review: Review) => review.userProfile.id === ownerData.userData?.id
            ) : false;

            if (authStore.accessToken && !hasOwnReview) {
                try {
                    const ownReviewResponse = type === 'course'
                        ? await getOwnCourseReview(id, authStore.accessToken)
                        : await getOwnTeacherReview(id, authStore.accessToken);

                    const ownReview = ownReviewResponse.review;
                    if (ownReviewResponse) {
                        const currentUserProfile = currentProfiles.find(
                            profile => profile.id === ownerData.userData?.id
                        );
                        if (currentUserProfile) {
                            processedReviews.unshift({
                                ...ownReview,
                                userProfile: currentUserProfile,
                                type: type,
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

    addReview: async (type: 'course' | 'teacher', id: number, rating: number, content: string) => {
        try {
            const authStore = useAuthStore.getState();

            if (!authStore.accessToken) {
                throw new Error('Unauthorized to add review');
            }

            if (type === 'course') {
                const courseStore = useCourseStore.getState();
                const course = courseStore.ownedCourses.find(course => course.id === id);
                if (course?.relationshipType !== 'PURCHASED') {
                    throw new Error('Unauthorized to add review');
                }
                await addCourseReview(id, rating, content, authStore.accessToken);
            } else {
                await addTeacherReview(id, rating, content, authStore.accessToken);
            }

            await get().fetchReviews(type, id, get().currentPage);
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    setSortDirection: async (direction: 'asc' | 'desc', id: number, type: 'course' | 'teacher') => {
        set({ sortDir: direction, currentPage: 0 });
        await get().fetchReviews(type, id, 0);
    },

    setSortBy: async (sort: 'date' | 'rating', id: number, type: 'course' | 'teacher') => {
        set({ sortBy: sort, currentPage: 0 });
        await get().fetchReviews(type, id, 0);
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
                await get().fetchReviews(currentReview.type, currentReview.contentId, get().currentPage);
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
            if (!currentReview) return;

            await deleteReview(reviewId, authStore.accessToken);

            try {
                await get().fetchReviews(currentReview.type, currentReview.contentId, get().currentPage);
            } catch {
                set(state => ({
                    ...state,
                    reviews: state.reviews.filter(review => review.id !== reviewId)
                }));
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}));