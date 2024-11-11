"use server"

import axios from "axios";

export const initiateChangePassword = async (accessToken: string) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/change-password/initiate`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
}