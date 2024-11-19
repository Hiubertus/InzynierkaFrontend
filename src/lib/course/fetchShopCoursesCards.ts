import axios from "axios";

export const fetchShopCoursesCards = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/get`);
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};