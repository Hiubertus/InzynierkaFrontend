import axios from "axios";

export const buyCourse = async (courseId: number, accessToken: string) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/course/buy`,
        {courseId},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        }
    );
}