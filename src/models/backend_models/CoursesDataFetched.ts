import {Roles} from "@/lib/stores/userStore";
import {QuizForm} from "@/models/front_models/CourseData";

export interface OwnedCoursesDataFetched {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    courses: [{
        courseData: CourseInfo,
        ownerData: UserProfileGet,
        }]
}
export interface ShopCoursesDataFetched {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    courses: [{
        ownerData: UserProfileGet,
        courseData: CourseInfo
    }]
}
export interface CreatedCoursesDataFetched {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    courses: CourseInfo[]
}

export interface CourseInfo {
    id: number,
    name: string,
    banner: {
        data: string,
        mimeType: string,
    },
    price: number,
    review: number,
    duration: number,
    createdAt: string,
    updatedAt: string,
    tags: string[],
    reviewNumber: number,
    ownerId: number,
    description: string,
    relationshipType: 'OWNER' | 'PURCHASED' | 'AVAILABLE',
}
export interface ContentInfo {
    id: number;
    subchapterId: number;
    type: 'text' | 'image' | 'video' | 'quiz';
    text: string;
    order: number ;
    fontSize: "small" | "medium" | "large";
    bolder: boolean ;
    italics: boolean ;
    underline: boolean ;
    textColor: string;
    file:  {
        data: string;
        mimeType: string;
    },
    "quizContent": QuizForm[]
}

export interface UserProfileGet {
    id: number,
    fullName: string,
    picture: {
        data: string;
        mimeType: string;
    },
    description: string,
    badges: string[],
    badgesVisible: boolean,
    createdAt: string,
    roles: Roles[]
    review?: number;
    reviewNumber?: number;
    teacherProfileCreatedAt?: Date;
}