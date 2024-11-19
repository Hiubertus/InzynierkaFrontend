import axios from "axios";

export const fetchOwnedCoursesCards = async (accessToken: string) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/get-purchased`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};