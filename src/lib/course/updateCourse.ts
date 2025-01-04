import axios from "axios";

export const updateCourse = async (
    data: FormData,
    accessToken: string,
) => {
    try {
        await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/update`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        return {
            success: true,
            message: 'Course updated succesfully'
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