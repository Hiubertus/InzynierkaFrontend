"use server"

import axios from "axios";

export const getAccessToken = async (token: string) => {
    return await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/access-token`,
        {token: token},
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}