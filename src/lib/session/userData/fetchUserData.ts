"use server"

import axios from "axios";
import { UserData } from "@/lib/stores/userStore";

export const fetchUserData = async (accessToken: string | null): Promise<UserData | null> => {
    if (!accessToken) {
        return null;
    }

    try {
        const response  = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/get`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data.data.user
        return {
            id: data.id,
            fullName: data.fullName,
            picture: null,
            pictureBase64: data.picture,
            mimeType: data.mimeType,
            description: data.description ?? '',
            badges: data.badges ?? [],
            badgesVisible: data.badgesVisible ?? false,
            email: data.email,
            points: data.points,
            role: data.role,
        };
    } catch (error) {

        console.error('Error fetching user data:', error);
        return null;
    }
};