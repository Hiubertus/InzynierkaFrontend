"use server"

import {cookies} from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = cookies();
        cookieStore.delete('refresh_token');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: 'An unexpected error occurred during logout' };
    }
}