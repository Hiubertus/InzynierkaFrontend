import axios from 'axios';

export const getWithdrawOffers = async (accessToken: string) => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/points/get-withdrawal-offers`, {headers: {
                'Authorization': `Bearer ${accessToken}`,
            }});
        return data.data.offers;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch offers');
        }
        throw error;
    }
};