"use server"

import axios from "axios";

export const getUserData = async (accessToken: string) => {
    return await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/get`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}