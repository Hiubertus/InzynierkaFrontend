import {ProfileData} from "@/models/ProfileData";

export interface UserData extends ProfileData {
    id: number;
    fullName: string;
    email: string;
    points: number;
    role: string;
}