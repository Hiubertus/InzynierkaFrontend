import {UserProfileGet} from "@/models/backend_models/CoursesDataFetched";

export interface ReviewDataGet {
    id: number,
    contentId: number,
    type: 'course' | 'user'
    content: string,
    rating: number;
    userProfile: UserProfileGet
    lastModified: Date
}