"use server"

import {getRefreshToken} from "@/lib/session/auth/getRefreshToken";
import {getAccessToken} from "@/lib/session/auth/getAccessToken";
import {getUserData} from "@/lib/session/userData/getUserData";

export const getInitialData = async () => {
    const token = await getRefreshToken();

    if (!token) {
        return {accessToken: null, userData: null};
    }
    try {
        const tokenResponse = await getAccessToken(token)

        if (!tokenResponse) {
            return {accessToken: null, userData: null};
        }

        const accessToken = tokenResponse.data.data.accessToken;

        const userResponse = await getUserData(accessToken)
        if (!userResponse) {
            return {accessToken, userData: null};
        }

        const userData = await userResponse.data.data.user;

        return {
            accessToken,
            userData: {
                id: userData.id,
                fullName: userData.fullName,
                picture: null,
                pictureBase64: userData.picture.data,
                mimeType: userData.picture.mimeType,
                description: userData.description ?? '',
                badges: userData.badges ?? [],
                badgesVisible: userData.badgesVisible ?? false,
                email: userData.email,
                points: userData.points,
                roles: userData.roles
            }
        };
    } catch (error) {
        console.error('Error getting initial data:', error);
        return {accessToken: null, userData: null};
    }
}