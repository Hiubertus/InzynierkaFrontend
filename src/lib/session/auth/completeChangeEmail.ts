import axios from "axios";

export const completeChangeEmail = async (newEmail: string, verificationCode: string, accessToken: string) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/change-email/complete`,
        {
            newEmail: newEmail,
            code: verificationCode
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );

}