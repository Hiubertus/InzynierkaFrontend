"use client"

import { useEffect, useState } from 'react'
import { UserProfilePageSkeleton } from "@/components/UserProfile/UserProfilePageSkeleton"
import { UserProfilePage } from "@/components/UserProfile/UserProfilePage"
import { getSession, type Session } from '@/lib/session/session'
import { updateUserField } from '@/lib/session/profileData'

export const UserProfile = () => {
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<Session | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const session = await getSession()
            if (session?.accessToken) {
                setUserData(session)
            }
            setLoading(false)
        }

        fetchUserData().then()
    }, [])

    const handleUpdateField = async (field: keyof Session, value: Session[keyof Session]) => {
        const result = await updateUserField(field, value)
        if (result.success && result.session) {
            setUserData(result.session)
        } else {
            throw new Error(result.error)
        }
    }

    if (loading || !userData) {
        return <UserProfilePageSkeleton />
    }

    return <UserProfilePage session={userData} updateUserField={handleUpdateField} />
}


