import axios from "axios";

export const getHistory = async (
    accessToken: string,
    page: number,
    size: number = 9,
) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/payment-history?page=${page}&size=${size}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );
        return response.data.data;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Error while getting history';
        throw new Error(errorMessage);
    }
};