import {Roles} from "@/lib/stores/userStore";

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
    createdAt: Date;
}