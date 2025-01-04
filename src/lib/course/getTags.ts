import axios from "axios";

export const getTags = async (

) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/tags/search`
        );
        return response.data.data.tags;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};