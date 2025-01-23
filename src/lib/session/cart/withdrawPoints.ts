import axios from 'axios';

export const withdrawPoints = async (offerId: number, accessToken: string) => {
    try {
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/points/withdraw/${offerId}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to withdraw points');
        }
        throw error;
    }
};