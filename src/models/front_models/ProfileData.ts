import {Roles} from "@/lib/stores/userStore";

export interface ProfileData {
    id: number;
    fullName: string;
    picture: File | null;
    description: string;
    badges: string[];
    badgesVisible: boolean;
    createdAt: Date;
    roles: Roles[]
    review: number | null;
    reviewNumber: number | null;
    teacherProfileCreatedAt: Date | null;
}