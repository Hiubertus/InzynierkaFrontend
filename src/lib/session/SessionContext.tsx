"use client"

import {ReactNode, useEffect} from 'react';
import {useAuthStore} from '@/lib/stores/authStore';
import {useUserStore} from '@/lib/stores/userStore';

type StoreProviderProps = {
    initialAccessToken: string | null;
    initialUserData: {
        id: number;
        email: string;
        points: number;
        fullName: string;
        picture: File | null;
        pictureBase64: string;
        pictureType: string;
        description: string;
        badges: string[];
        badgesVisible: boolean;
        role: 'USER' | 'VERIFIED' | 'TEACHER' | 'ADMIN';
    } | null;
    children: ReactNode;
};

export function StoreProvider({
                                  initialAccessToken,
                                  initialUserData,
                                  children
                              }: StoreProviderProps) {
    const { setAccessToken, clearAuth } = useAuthStore();
    const { setUserData, clearUserData } = useUserStore();

    useEffect(() => {
        if (initialAccessToken) {
            setAccessToken(initialAccessToken);
        }
        if (initialUserData) {
            setUserData(initialUserData);
        }
    }, [initialAccessToken, initialUserData, setAccessToken, setUserData]);

    useEffect(() => {
        const refreshTokenInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to refresh token');
                }

                const data = await response.json();
                setAccessToken(data.accessToken);
            } catch (error) {
                console.error('Error refreshing token:', error);
                clearAuth();
                clearUserData();
            }
        }, 14 * 60 * 1000);

        return () => clearInterval(refreshTokenInterval);
    }, [clearAuth, clearUserData, setAccessToken]);

    useEffect(() => {
        function handleStorageChange(e: StorageEvent) {
            if (e.key === 'auth-storage' || e.key === 'user-storage') {
                window.location.reload();
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return <>{children}</>;
}