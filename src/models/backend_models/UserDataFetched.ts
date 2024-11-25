import {Roles} from "@/lib/stores/userStore";

export interface UserDataLogin {
    accessToken: string;
    refreshToken: string;
    userData: UserDataGet
}

export interface UserDataGet {
    id: number;
    email: string;
    points: number;
    fullName: string;
    picture: {
        data: string,
        mimeType: string;
    };
    description: string;
    badges: string[];
    badgesVisible: boolean;
    roles: Roles[];
}