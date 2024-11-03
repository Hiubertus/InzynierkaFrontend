'use server'

import { getSession, setSession, type Session } from './session'

export async function updateUserField(changes: Partial<Session>) {

    try {
        const session = await getSession()
        if (!session?.accessToken) {
            throw new Error('No active session')
        }

        console.log('Updating user profile with changes:', JSON.stringify(changes))

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user-profile/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(changes)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        let responseData = null
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            try {
                const text = await response.text()
                if (text) {
                    responseData = JSON.parse(text)
                }
            } catch (e) {
                console.log('Response parsing error:', e)
            }
        }

        const updatedSession: Session = {
            ...session,
            ...changes
        }

        await setSession(updatedSession)

        return {
            success: true,
            session: updatedSession,
            responseData
        }

    } catch (error) {
        console.error('Error updating user profile:', error)
        throw error
    }
}