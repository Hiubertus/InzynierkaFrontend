"use server"

import {setRefreshToken} from "@/lib/session/auth/setRefreshToken";
import {UserData} from "@/lib/stores/userStore";

interface LoginResponse {
    success: boolean;
    accessToken?: string;
    userData?: UserData;
    error?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
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

            setRefreshToken(data.data.user.refreshToken);

            return {
                success: true,
                accessToken: data.data.user.accessToken,
                userData: {
                    id: data.data.user.id,
                    fullName: data.data.user.fullName,
                    picture: null,
                    pictureBase64: data.data.user.picture,
                    mimeType: data.data.user.mimeType,
                    description: data.data.user.description ?? '',
                    badges: data.data.user.badges ?? [],
                    badgesVisible: data.data.user.badgesVisible ?? false,
                    email: data.data.user.email,
                    points: data.data.user.points,
                    roles: data.data.user.role,
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