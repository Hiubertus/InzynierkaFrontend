import axios from "axios";

export const getCourseToEdit = async (
    accessToken: string,
    courseId: number
) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/${courseId}/edit`,
            {headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
        return response.data.data.course;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};