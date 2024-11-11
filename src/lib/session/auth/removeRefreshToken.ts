"use server"

import {cookies} from "next/headers";

export const removeRefreshToken = async () => {
    const cookieStore = cookies();
    cookieStore.delete('refresh_token');
};
