import axios from "axios";

export const canAddReviewToTeacher = async (
    teacherId: number,
    accessToken: string | null
) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/can-review-teacher/${teacherId}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data.data.canReview;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};