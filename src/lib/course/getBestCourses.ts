import axios from "axios";

export const getBestCourses = async (accessToken: string | null) => {
    try {
        const config = accessToken
            ? { headers: { 'Authorization': `Bearer ${accessToken}` } }
            : {};
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/get-best`,
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