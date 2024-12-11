import axios from "axios";

export const deleteReview = async (
    reviewId: number,
    accessToken: string | null
) => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/review/delete/${reviewId}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};