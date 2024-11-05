"use server"

import { cookies } from 'next/headers';

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();

            const cookieStore = cookies();

            cookieStore.set('refresh_token', data.data.user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });

            return {
                success: true,
                accessToken: data.data.user.accessToken,
                userData: {
                    id: data.data.user.id,
                    fullName: data.data.user.fullName,
                    picture: null,
                    pictureBase64: data.data.user.picture,
                    pictureType: data.data.user.pictureType,
                    description: data.data.user.description ?? '',
                    badges: data.data.user.badges ?? [],
                    badgesVisible: data.data.user.badgesVisible ?? false,
                    email: data.data.user.email,
                    points: data.data.user.points,
                    role: data.data.user.role,
                }
            };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function logout() {
    try {
        const cookieStore = cookies();
        cookieStore.delete('refresh_token');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: 'An unexpected error occurred during logout' };
    }
}
