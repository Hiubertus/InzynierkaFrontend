"use server"

import {setRefreshToken} from "@/lib/session/auth/setRefreshToken";
import {UserData} from "@/lib/stores/userStore";
import axios from "axios";

interface LoginResponse {
    success: boolean;
    accessToken?: string;
    userData?: UserData;
    error?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/login`,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.data.data.user) {
            const data = response.data.data.user

            await setRefreshToken(data.refreshToken);


            return {
                success: true,
                accessToken: data.accessToken,
                userData: {
                    id: data.id,
                    fullName: data.fullName,
                    picture: null,
                    pictureBase64: data.picture.data ,
                    mimeType: data.picture.mimeType,
                    description: data.description ?? '',
                    badges: data.badges ?? [],
                    badgesVisible: data.badgesVisible ?? false,
                    email: data.email,
                    points: data.points,
                    roles: data.roles
                }
            };
        } else {
            return { success: false, error: 'Login failed' };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}