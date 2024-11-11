'use server'

export async function updateUserProfile(formData: FormData, accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user-profile/update`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
}