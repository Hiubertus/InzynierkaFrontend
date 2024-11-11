"use server"

import axios from "axios";

export const initiateChangeEmail = async (accessToken: string) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/change-email/initiate`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
}
