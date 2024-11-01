'use server'

import { getSession, setSession, type Session } from './session'

export async function updateUserField(field: keyof Session, value: Session[keyof Session]) {
    try {
        const session = await getSession()
        if (!session?.accessToken) {
            throw new Error('No active session')
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user-profile/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ [field]: value })
        })
        // console.log(session.accessToken)
        // console.log(response)
        if (response.ok) {
            const updatedSession: Session = {
                ...session,
                [field]: value
            }
            await setSession(updatedSession)
            return { success: true, session: updatedSession }
        } else {
            const errorData = await response.json()
            return { success: false, error: errorData.message || 'Update failed' }
        }
    } catch (error) {
        console.error('Error updating user field:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
