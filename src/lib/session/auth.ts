'use server'

import { getSession, setSession, removeSession, type Session } from './session'

export async function refreshAccessToken(refresh_token: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_ADDRESS}/user/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token }),
        })

        if (response.ok) {
            const data = await response.json()
            const session = await getSession()

            if (session) {
                const updatedSession: Session = {
                    ...session,
                    accessToken: data.accesToken,
                }
                await setSession(updatedSession)
                return updatedSession
            }
        }

        await removeSession()
        return null
    } catch (error) {
        console.error('Error refreshing token:', error)
        await removeSession()
        return null
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            const data = await response.json()
            const session: Session = {
                id: data.data.user.id,
                fullName: data.data.user.fullName,
                picture: data.data.user.picture ? data.data.user.picture : [],
                description: data.data.user.description ? data.data.user.description : '',
                badges: data.data.user.badges ? data.data.user.badges : [],
                badgesVisible: data.data.user.badgesVisible ? data.data.user.badgesVisible : false,
                email: data.data.user.email,
                points: data.data.user.points,
                accessToken: data.data.user.accessToken,
                refreshToken: data.data.user.refreshToken,
                role: data.data.user.role,
            }

            await setSession(session)
            console.log(session)
            return { success: true, session }
        } else {
            const errorData = await response.json()
            return { success: false, error: errorData.message || 'Login failed' }
        }
    } catch (error) {
        console.log('Error during login:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}