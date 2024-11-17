import {ProfileData} from "@/models/front_models/ProfileData";

export async function getUserProfile(userId: string): Promise<ProfileData> {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user profile')
    }

    return response.json()
}