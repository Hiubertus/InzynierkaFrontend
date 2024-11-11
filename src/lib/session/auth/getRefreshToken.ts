"use server"

import { cookies } from 'next/headers'

export const getRefreshToken = async (): Promise<string | null> => {
    const cookieStore = cookies()
    const refreshTokenCookie = cookieStore.get('refresh_token')

    if (refreshTokenCookie?.value) {
        try {
            return refreshTokenCookie.value
        } catch {

            return null
        }
    }
    return null
}
