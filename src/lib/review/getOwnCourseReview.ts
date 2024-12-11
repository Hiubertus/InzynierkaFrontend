import axios from "axios";

export const getOwnCourseReview = async (
    id: number,
    accessToken: string | null,

) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/review/user/course/${id}`,
            {headers: { 'Authorization': `Bearer ${accessToken}` }},
        );
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};