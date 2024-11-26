"use client"

import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {useAuthStore} from '@/lib/stores/authStore';
import {Roles, useUserStore} from '@/lib/stores/userStore';
import {toast} from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import useProfileStore from "@/lib/stores/profileStore";
import {convertPictureToFile} from "@/lib/utils/conversionFunction";

type StoreProviderProps = {
    initialAccessToken: string | null;
    initialUserData: {
        id: number;
        email: string;
        points: number;
        fullName: string;
        picture: File | null;
        pictureBase64: string;
        mimeType: string;
        description: string;
        badges: string[];
        badgesVisible: boolean;
        roles: Roles[];
    } | null;
    children: ReactNode;
};

export function StoreProvider({
                                  initialAccessToken,
                                  initialUserData,
                                  children
                              }: StoreProviderProps) {
    const { setAccessToken, clearAuth, setInitialized: setAuthInitialized  } = useAuthStore();
    const { setUserData, clearUserData, setInitialized: setUserInitialized  } = useUserStore();
    const { profiles, setProfiles} = useProfileStore();
    const isInitialized = useRef(false);

    useEffect(() => {
        function handleStorageChange(e: StorageEvent) {
            if (e.key === 'auth-storage' || e.key === 'user-storage') {
                setAuthInitialized(false);
                setUserInitialized(false);
                window.location.reload();
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [setAuthInitialized, setUserInitialized]);

    useEffect(() => {
        if (isInitialized.current) return;

        const initializeStores = () => {
            if (initialAccessToken) {
                setAccessToken(initialAccessToken);
            }

            if (initialUserData) {
                setUserData(initialUserData);
                const userProfile = {
                    id: initialUserData.id,
                    fullName: initialUserData.fullName,
                    picture: convertPictureToFile(initialUserData.pictureBase64, initialUserData.mimeType),
                    description: initialUserData.description,
                    badges: initialUserData.badges || [],
                    badgesVisible: initialUserData.badgesVisible,
                    createdAt: new Date()
                };

                // Update or add user profile while preserving other profiles
                const existingProfileIndex = profiles.findIndex(p => p.id === initialUserData.id);
                if (existingProfileIndex !== -1) {
                    const updatedProfiles = [...profiles];
                    updatedProfiles[existingProfileIndex] = userProfile;
                    setProfiles(updatedProfiles);
                } else {
                    setProfiles([...profiles, userProfile]);
                }
            }

            setAuthInitialized(true);
            setUserInitialized(true);
            isInitialized.current = true;
        };

        initializeStores();
    }, [initialAccessToken, initialUserData, setAccessToken, setAuthInitialized, setUserInitialized, setUserData, setProfiles, profiles]);

    const handleVerificationRequest = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user/resend-verification`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initialAccessToken}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send verification email');
            }

            toast({
                title: "Email wysłany",
                description: "Link weryfikacyjny został wysłany na Twój adres email.",
                variant: "success",
                duration: 5000,
            });

        } catch (error) {
            console.error('Error sending verification email:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się wysłać emaila weryfikacyjnego. Spróbuj ponownie później.",
                variant: "destructive",
                duration: 5000,
            });
        }
    }, [initialAccessToken]);


    useEffect(() => {
        if (initialAccessToken && initialUserData?.roles?.includes('USER') && !initialUserData?.roles?.includes('VERIFIED')) {
            toast({
                title: "Weryfikacja email wymagana",
                description: "Prosze zweryfikować email by móc korzystać z większej ilości usług.",
                duration: 5000,
                variant: "default",
                action: (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVerificationRequest}
                    >
                        Zweryfikuj
                    </Button>
                ),
            });
        }
    }, [handleVerificationRequest, initialAccessToken, initialUserData?.roles]);

    useEffect(() => {
        if (initialAccessToken && initialUserData?.roles?.includes('USER')) {
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
        }
    }, [clearAuth, clearUserData, initialAccessToken, initialUserData?.roles, setAccessToken]);



    return <>{children}</>;
}