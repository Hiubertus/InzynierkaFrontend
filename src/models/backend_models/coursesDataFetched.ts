
export interface courses {
    courseData: {
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
    }
    ownerData: {
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
    }
}