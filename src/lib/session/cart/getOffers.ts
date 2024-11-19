import axios from 'axios';

export const getPointOffers = async () => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/points/get-offers`);
        return data.data.offers;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch offers');
        }
        throw error;
    }
};