"use client"

import {useEffect} from 'react'
import {UserProfilePageSkeleton} from "@/components/UserProfile/UserProfilePageSkeleton"
import {UserProfilePage} from "@/components/UserProfile/UserProfilePage"
import {useAuthStore} from "@/lib/stores/authStore"
import {useUserStore} from "@/lib/stores/userStore"
import {fetchUserData} from "@/lib/session/userData/fetchUserData";

export const UserProfile = () => {
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
        return <UserProfilePageSkeleton/>;
    }

    return <UserProfilePage accessToken={accessToken}
                            userData={userData} updateUserField={updateUserField}/>;
};