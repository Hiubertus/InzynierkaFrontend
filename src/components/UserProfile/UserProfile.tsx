"use client"

import { useEffect } from 'react'
import { UserProfilePageSkeleton } from "@/components/UserProfile/UserProfilePageSkeleton"
import { UserProfilePage } from "@/components/UserProfile/UserProfilePage"
import { useAuthStore } from "@/lib/stores/authStore";
import { useUserStore } from "@/lib/stores/userStore";

export const UserProfile = () => {
    const { accessToken } = useAuthStore()
    const { userData, setUserData } = useUserStore()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/get`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();

                setUserData({
                    id: data.id,
                    fullName: data.fullName,
                    picture: null,
                    pictureBase64: data.picture,
                    pictureType: data.pictureType,
                    description: data.description ?? '',
                    badges: data.badges ?? [],
                    badgesVisible: data.badgesVisible ?? false,
                    email: data.email,
                    points: data.points,
                    role: data.role,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (accessToken && !userData) {
            fetchUserData();
        }
    }, [accessToken, userData, setUserData]);

    if (!accessToken || !userData) {
        return <UserProfilePageSkeleton />;
    }

    return <UserProfilePage />;
};