import {ProfileData} from "@/models/front_models/ProfileData";

export interface Review {
    id: number,
    contentId: number,
    type: 'course' | 'teacher'
    content: string,
    rating: number;
    userProfile: ProfileData
    lastModified: Date
}