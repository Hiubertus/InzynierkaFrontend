'use server'

import axios from "axios";

interface CreateCourseResponse {
    success: boolean;
    message?: string;
    courseId?: number;
}

export const createCourse = async (
    data: FormData,
    accessToken: string
): Promise<CreateCourseResponse> => {
    try {
       await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/create`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        return {
            success: true,
            message: 'Course created successfully'
        };

    } catch (error) {
        console.error('Error creating course:', error);
        return {
            success: false,
            message: axios.isAxiosError(error)
                ? error.response?.data?.message || 'Failed to create course'
                : 'Failed to create course'
        };
    }
}