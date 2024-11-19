import axios from "axios";

export async function becomeTeacherComplete(accessToken: string | null) {
    if (!accessToken) {
        throw new Error("User is not logged in");
    }

    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/upgrade-to-teacher`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
}