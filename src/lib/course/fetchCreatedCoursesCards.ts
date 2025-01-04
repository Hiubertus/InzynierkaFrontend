import axios from "axios";

export const fetchCreatedCoursesCards = async (id: number, page = 0, size = 9, search?: string, tag?: string) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/user/${id}?page=${page}&size=${size}`;
        if (search) url += `&search=${search}`;
        if (tag) url += `&tag=${tag}`;
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};