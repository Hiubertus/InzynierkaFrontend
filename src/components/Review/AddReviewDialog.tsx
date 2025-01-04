import {useEffect, useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useReviewStore } from '@/lib/stores/reviewStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/lib/stores/authStore'
import { Star } from 'lucide-react'
import { canAddReviewToTeacher } from '@/lib/review/canAddReviewToTeacher';

interface AddReviewDialogProps {
    contentId: number;
    type: 'course' | 'teacher';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const AddReviewDialog = ({
                                    contentId,
                                    type,
                                    open,
                                    onOpenChange,
                                    onSuccess
                                }: AddReviewDialogProps) => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canReview, setCanReview] = useState<boolean>(true);
    const { accessToken } = useAuthStore();
    const { addReview } = useReviewStore();

    useEffect(() => {
        const checkCanReview = async () => {
            if (type === 'teacher' && accessToken) {
                try {
                    const canReviewResult = await canAddReviewToTeacher(contentId, accessToken);
                    setCanReview(canReviewResult);
                    if (!canReviewResult) {
                        onOpenChange(false);
                    }
                } catch (error) {
                    console.error('Error checking if can review teacher:', error);
                    setCanReview(false);
                    onOpenChange(false);
                }
            }
        };

        checkCanReview();
    }, [type, contentId, accessToken, onOpenChange]);

    const handleSubmit = async () => {
        if (rating === 0 || !content.trim() || !accessToken || !canReview) return;

        setIsSubmitting(true);
        try {
            await addReview(type, contentId, rating, content);
            onOpenChange(false);
            setRating(0);
            setContent('');
            onSuccess?.();
        } catch (error) {
            console.error('Error adding review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {type === 'course' ? 'Add Course Review' : 'Add Teacher Review'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                onClick={() => setRating(value)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`h-6 w-6 ${
                                        value <= rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Write your review..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0 || !content.trim()}
                        >
                            Submit Review
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};