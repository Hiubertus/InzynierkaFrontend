import axios from "axios";

export const completeChangePassword = async(newPassword: string, verificationCode: string, accessToken: string) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/change-password/complete`,
        {
            newPassword: newPassword,
            code: verificationCode
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
}