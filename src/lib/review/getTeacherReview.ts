import axios from "axios";

export const getTeacherReviews = async (
    id: number,
    page = 0,
    size = 3,
    sortDir: 'asc' | 'desc',
    sortBy: 'date' | 'rating',
    accessToken: string | null
) => {
    try {
        const config = accessToken
            ? { headers: { 'Authorization': `Bearer ${accessToken}` } }
            : {};
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/review/get/teacher/${id}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
            config
        );
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};