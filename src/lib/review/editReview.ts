import axios from "axios";

export const editReview = async (
    reviewId: number,
    rating: number,
    content: string,
    accessToken: string | null
) => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/review/update/${reviewId}`,
            {rating, content},
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