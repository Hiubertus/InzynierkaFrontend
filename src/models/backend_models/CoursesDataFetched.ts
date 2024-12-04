import {Roles} from "@/lib/stores/userStore";

export interface OwnedCoursesDataFetched {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    courses: [{
        courseData: CourseInfo,
        ownerData: OwnerInfo,
        }]
}
export interface ShopCoursesDataFetched {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    courses: [{
        ownerData: OwnerInfo,
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

export interface OwnerInfo {
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
}