import axios from "axios";

export const getCourseSubchapters = async (id: number, accessToken: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/chapter/get/${id}`,
            {headers: {
                'Authorization': `Bearer ${accessToken}`
            }});
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};