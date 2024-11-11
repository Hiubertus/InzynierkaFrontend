"use server"

import { cookies } from 'next/headers';

export const setRefreshToken = async (token: string) => {
    const cookieStore = cookies();
    cookieStore.set('refresh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
};