"use server"

import {cookies} from "next/headers";
import axios from "axios";

export const logout = async (accessToken: string | null) => {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refresh_token')

        await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/logout`,
            { refreshToken },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        cookieStore.delete('refresh_token');

        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: 'An unexpected error occurred during logout' };
    }
}