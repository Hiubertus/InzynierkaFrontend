import React, { useEffect, useState } from 'react';
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

interface ReviewListProps {
    courseId: number;
    relationshipType: 'PURCHASED' | 'OWNER' | 'AVAILABLE' | null;
    isReadyForReviews: boolean;
}

export const ReviewList = ({
                               courseId,
                               relationshipType,
                               isReadyForReviews
                           }: ReviewListProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
    const { accessToken } = useAuthStore();
    const { userData } = useUserStore();
    const {
        reviews,
        totalPages,
        currentPage,
        sortDir,
        sortBy,
        fetchCourseReviews,
        setSortDirection,
        setSortBy
    } = useReviewStore();

    // Znajdź własną recenzję wśród wszystkich recenzji
    const ownReview = userData ? reviews.find(review =>
        review.userProfile.id === userData.id
    ) : null;

    const loadReviews = async (page?: number) => {
        if (!isReadyForReviews) return;

        setIsLoading(true);
        try {
            await fetchCourseReviews(courseId, page);
            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsInitialized(false);
        setIsLoading(true);
    }, [courseId]);

    useEffect(() => {
        if (isReadyForReviews && !isInitialized) {
            loadReviews();
        }
    }, [courseId, accessToken, userData, isReadyForReviews]);

    const handleSortChange = async (newSortBy: 'date' | 'rating') => {
        setSortBy(newSortBy);
        await loadReviews(0);
    };

    const handleDirectionChange = async () => {
        setSortDirection(sortDir === 'asc' ? 'desc' : 'asc');
        await loadReviews(0);
    };

    const handlePageChange = (page: number) => {
        loadReviews(page - 1);
    };

    const renderSortButtons = () => (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange(sortBy === 'date' ? 'rating' : 'date')}
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
                onClick={handleDirectionChange}
            >
                <ArrowUpDown className="h-4 w-4" />
            </Button>
        </div>
    );

    const renderReviewCreator = () => {
        if (!userData) {
            return (
                <Card className="mb-4 bg-muted">
                    <CardContent className="p-6 text-center">
                        <p>Zaloguj się, aby móc dodać recenzję</p>
                    </CardContent>
                </Card>
            );
        }

        if (relationshipType === 'OWNER') {
            return null;
        }

        if (relationshipType !== 'PURCHASED') {
            return (
                <Card className="mb-4 bg-muted">
                    <CardContent className="p-6 text-center">
                        <p>Kup kurs, aby móc dodać recenzję</p>
                    </CardContent>
                </Card>
            );
        }

        if (!ownReview) {
            return (
                <Card className="mb-4">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Dodaj swoją recenzję</h3>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddReviewOpen(true)}
                            className="w-full"
                        >
                            Napisz recenzję
                        </Button>
                        <AddReviewDialog
                            courseId={courseId}
                            open={isAddReviewOpen}
                            onOpenChange={setIsAddReviewOpen}
                            onSuccess={() => loadReviews(currentPage)}
                        />
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Twoja recenzja</h3>
                <Review
                    profile={ownReview.userProfile}
                    rating={ownReview.rating}
                    content={ownReview.content}
                    lastModified={new Date(ownReview.lastModified)}
                    id={ownReview.id}
                />
            </div>
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
            {renderReviewCreator()}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wszystkie recenzje</h3>
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
                            .filter(review => review.userProfile.id !== userData?.id)
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
                            Brak recenzji dla tego kursu
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};