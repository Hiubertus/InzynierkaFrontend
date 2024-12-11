import axios from "axios";

export const addCourseReview = async (
    id: number,
    rating: number,
    content: string,
    accessToken: string | null
) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/review/add/course/${id}`,
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