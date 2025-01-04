import React, {useCallback, useEffect, useState} from 'react';
import { Review } from './Review';
import { useReviewStore } from '@/lib/stores/reviewStore';
import { ReviewSkeleton } from './ReviewSkeleton';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';
import { AddReviewDialog } from './AddReviewDialog';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStore } from "@/lib/stores/userStore";
import { ArrowUpDown, CalendarDays, Star } from "lucide-react";
import PaginationControls from "@/components/Pagination/Pagination";
import {useProfileStore} from "@/lib/stores/profileStore";
import {useCourseStore} from "@/lib/stores/courseStore";
import { canAddReviewToTeacher } from '@/lib/review/canAddReviewToTeacher';

interface ReviewListProps {
    contentId: number;
    type: 'course' | 'teacher';
    ownerId?: number;
    relationshipType?: 'PURCHASED' | 'OWNER' | 'AVAILABLE' | null;
    isReadyForReviews?: boolean;
}

export const ReviewList = ({
                               contentId,
                               type,
                               ownerId,
                               relationshipType,
                               isReadyForReviews = true
                           }: ReviewListProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
    const [canReviewTeacher, setCanReviewTeacher] = useState<boolean | null>(null);
    const { accessToken } = useAuthStore();
    const { userData } = useUserStore();
    const {
        reviews,
        totalPages,
        currentPage,
        sortDir,
        sortBy,
        fetchReviews,
        setSortDirection,
        setSortBy
    } = useReviewStore();
    const { fetchSingleCourse } = useCourseStore();
    const { fetchProfile } = useProfileStore();

    const ownReview = userData ? reviews.find(review =>
        review.userProfile.id === userData.id
    ) : null;

    const canAddReview = useCallback(async () => {
        if (!userData || !accessToken) return false;

        if (type === 'course') {
            if (relationshipType === 'OWNER') return false;
            return relationshipType === 'PURCHASED';
        }

        if (type === 'teacher') {
            if (userData.id === ownerId) return false;
            try {
                const canReview = await canAddReviewToTeacher(contentId, accessToken);
                console.log(canReview)
                setCanReviewTeacher(canReview);
                return canReview;
            } catch (error) {
                console.error('Error checking if can review teacher:', error);
                return false;
            }
        }

        return false;
    }, [userData, accessToken, type, relationshipType, ownerId, contentId]);

    useEffect(() => {
        if (type === 'teacher' && userData && accessToken) {
            canAddReview();
        }
    }, [type, userData, accessToken, canAddReview]);

    const loadReviews = useCallback(async (page?: number) => {
        if (!isReadyForReviews) return;

        setIsLoading(true);
        try {
            await fetchReviews(type, contentId, page);
            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    }, [contentId, fetchReviews, isReadyForReviews, type]);

    const handleReviewChange = async () => {
        // Odświeżamy recenzje
        await loadReviews(currentPage);

        if (type === 'course') {
            await fetchSingleCourse(contentId, accessToken);
        } else if (type === 'teacher') {
            await fetchProfile(contentId);
        }
    };

    useEffect(() => {
        setIsInitialized(false);
        setIsLoading(true);
    }, [contentId]);

    useEffect(() => {
        if (isReadyForReviews && !isInitialized) {
            loadReviews();
        }
    }, [contentId, accessToken, userData, isReadyForReviews, isInitialized, loadReviews]);

    const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
        setSortDirection(direction, contentId, type);
    };

    const handleSortByChange = (sort: 'date' | 'rating') => {
        setSortBy(sort, contentId, type);
    };

    const handlePageChange = (page: number) => {
        loadReviews(page - 1);
    };

    const renderSortButtons = () => (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortByChange(sortBy === 'date' ? 'rating' : 'date')}
            >
                {sortBy === 'date' ? (
                    <CalendarDays className="h-4 w-4" />
                ) : (
                    <Star className="h-4 w-4" />
                )}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortDirectionChange(sortDir === 'asc' ? 'desc' : 'asc')}
            >
                <ArrowUpDown className="h-4 w-4" />
            </Button>
        </div>
    );

    const renderAddReviewSection = () => {
        if (!userData || !accessToken) {
            return (
                <Card className="mb-4 bg-muted">
                    <CardContent className="p-6 text-center">
                        <p>Log in to add a review</p>
                    </CardContent>
                </Card>
            );
        }


        if (type === 'teacher' && !canReviewTeacher) {
            return (
                <Card className="mb-4 bg-muted">
                    <CardContent className="p-6 text-center">
                        <p>You need to purchase a course from this teacher to leave a review</p>
                    </CardContent>
                </Card>
            );
        }

        if (!canAddReview() || relationshipType === 'OWNER') {
            return null;
        }

        if (ownReview) {
            return (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Your review</h3>
                    <Review
                        key={ownReview.id}
                        id={ownReview.id}
                        profile={ownReview.userProfile}
                        rating={ownReview.rating}
                        content={ownReview.content}
                        lastModified={new Date(ownReview.lastModified)}
                        onReviewChange={handleReviewChange}
                    />
                </div>
            );
        }

        return (
            <Card className="mb-4">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Add your review</h3>
                    <Button
                        variant="outline"
                        onClick={() => setIsAddReviewOpen(true)}
                        className="w-full"
                    >
                        Write a review
                    </Button>
                    <AddReviewDialog
                        contentId={contentId}
                        type={type}
                        open={isAddReviewOpen}
                        onOpenChange={setIsAddReviewOpen}
                        onSuccess={handleReviewChange}
                    />
                </CardContent>
            </Card>
        );
    };

    if (!isReadyForReviews || !isInitialized) {
        return (
            <div className="space-y-4">
                <ReviewSkeleton />
                <ReviewSkeleton />
                <ReviewSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {renderAddReviewSection()}

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">All reviews</h3>
                {renderSortButtons()}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <ReviewSkeleton />
                        <ReviewSkeleton />
                        <ReviewSkeleton />
                    </div>
                ) : reviews.length > 0 ? (
                    <>
                        {reviews
                            .filter(review => {
                                return userData ? review.userProfile.id !== userData.id : true;
                            })
                            .map((review) => (
                                <Review
                                    key={review.id}
                                    id={review.id}
                                    profile={review.userProfile}
                                    rating={review.rating}
                                    content={review.content}
                                    lastModified={new Date(review.lastModified)}
                                />
                            ))}
                        <div className="mt-6 flex justify-center">
                            <PaginationControls
                                currentPage={currentPage + 1}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No reviews yet
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};