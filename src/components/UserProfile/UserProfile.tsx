"use client"

import { useEffect, useState } from 'react'
import { UserProfilePageSkeleton } from "@/components/UserProfile/UserProfilePageSkeleton"
import { UserProfilePage } from "@/components/UserProfile/UserProfilePage"
import { getSession, type Session } from '@/lib/session/session'
import { updateUserField } from '@/lib/session/profileData'

export const UserProfile = () => {
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<Session | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const session = await getSession()
                if (session?.accessToken) {
                    setUserData(session)
                }
            } catch (e) {
                setError('Failed to fetch user data')
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleUpdateFields = async (changes: Partial<Session>) => {
        try {
            setError(null)
            console.log('Updating profile with changes:', changes)

            const result = await updateUserField(changes)

            if (result.success && result.session) {
                setUserData(result.session)
            } else {
                throw new Error('Update failed')
            }
        } catch (e) {
            setError('Failed to update profile')
            console.error('Update error:', e)
            throw e
        }
    }

    if (loading || !userData) {
        return <UserProfilePageSkeleton />
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <UserProfilePage
            session={userData}
            updateUserField={handleUpdateFields}
        />
    )
}