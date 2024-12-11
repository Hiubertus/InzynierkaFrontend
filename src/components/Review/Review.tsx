import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProfileData } from "@/models/front_models/ProfileData";
import { AvatarComponent } from "@/components/AvatarComponent/AvatarComponent";
import { formatDate } from "@/lib/utils/formatDate";
import { StarRating } from '@/components/StarRating/StarRating';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserStore } from "@/lib/stores/userStore";
import {useReviewStore} from "@/lib/stores/reviewStore";

interface ReviewProps {
    id: number;
    profile: ProfileData;
    rating: number;
    content: string;
    lastModified: Date;
}

export const Review = ({
                           id,
                           profile,
                           rating,
                           content,
                           lastModified,
                       }: ReviewProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editedRating, setEditedRating] = useState(rating);
    const [editedContent, setEditedContent] = useState(content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { editReview, deleteReview } = useReviewStore();
    const { userData } = useUserStore();
    const isOwnReview = userData?.id === profile.id;

    const handleEdit = async () => {
        setIsSubmitting(true);
        try {
            await editReview(id, editedRating, editedContent);
            setIsEditOpen(false);
        } catch (error) {
            console.error('Failed to edit review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteReview(id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const handleRatingChange = (newRating: number) => {
        setEditedRating(newRating);
    };

    return (
        <>
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <AvatarComponent userProfile={profile}/>
                            <div className="space-y-1">
                                <h3 className="font-semibold">{profile.fullName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(lastModified)}
                                </p>
                                <StarRating
                                    rating={rating}
                                    ratingNumber={1}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        {isOwnReview && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsEditOpen(true)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsDeleteOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-sm">{content}</p>
                </CardContent>
            </Card>

            {/* Dialog edycji */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <StarRating
                            rating={editedRating}
                            ratingNumber={1}
                            className="justify-center"
                            onRatingChange={handleRatingChange}
                        />
                        <Textarea
                            placeholder="Write your review..."
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={4}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEdit}
                                disabled={isSubmitting || editedRating === 0 || !editedContent.trim()}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};