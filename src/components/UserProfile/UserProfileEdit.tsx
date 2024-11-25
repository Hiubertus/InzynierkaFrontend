"use client"

import {useEffect} from 'react'
import {UserProfileEditPageSkeleton} from "@/components/UserProfile/UserProfileEditPageSkeleton"
import {UserProfileEditPage} from "@/components/UserProfile/UserProfileEditPage"
import {useAuthStore} from "@/lib/stores/authStore"
import {useUserStore} from "@/lib/stores/userStore"
import {fetchUserData} from "@/lib/session/userData/fetchUserData";

export const UserProfileEdit = () => {
    const {accessToken, clearAuth} = useAuthStore()
    const {userData, updateUserField, setUserData, clearUserData} = useUserStore()

    useEffect(() => {
        const loadUserData = async () => {
            const data = await fetchUserData(accessToken);
            if (data) {
                setUserData(data);
            } else {
                clearAuth()
                clearUserData();
            }
        };

        if (accessToken) {
            loadUserData();
        } else {
            clearAuth()
            clearUserData();
        }
    }, [accessToken, clearAuth, clearUserData, setUserData]);
    if (!accessToken || !userData) {
        return <UserProfileEditPageSkeleton/>;
    }

    return <UserProfileEditPage accessToken={accessToken}
                                userData={userData} updateUserField={updateUserField}/>;
};