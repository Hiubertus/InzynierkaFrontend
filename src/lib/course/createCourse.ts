'use server'

interface CreateCourseResponse {
    success: boolean;
    message?: string;
    courseId?: number;
}

export async function createCourse(
    data: FormData,
    accessToken: string
): Promise<CreateCourseResponse> {
    try {
        if (!process.env.NEXT_PUBLIC_BACKEND_ADDRESS) {
            throw new Error('Backend address not configured');
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/create`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },

                body: data,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create course');
        }

        return {
            success: true,
            message: 'Course created successfully'
        };

    } catch (error) {
        console.error('Error creating course:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create course'
        };
    }
}