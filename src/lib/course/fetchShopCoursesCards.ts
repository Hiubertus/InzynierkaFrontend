import axios from "axios";

export const fetchShopCoursesCards = async (accessToken: string | null, page = 0, size = 9, search?: string, tag?: string) => {
    try {
        const config = accessToken
            ? { headers: { 'Authorization': `Bearer ${accessToken}` } }
            : {};
        let url = `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/get?page=${page}&size=${size}`;
        if (search) url += `&search=${search}`;
        if (tag) url += `&tag=${tag}`;
        const response = await axios.get(url, config);
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas pobierania kursów';
        throw new Error(errorMessage);
    }
};