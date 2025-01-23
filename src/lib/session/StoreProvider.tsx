"use client"

import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {useAuthStore} from '@/lib/stores/authStore';
import {Roles, useUserStore} from '@/lib/stores/userStore';
import {toast} from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { useProfileStore } from "@/lib/stores/profileStore";

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
    const { profiles, fetchProfile} = useProfileStore();
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

        const initializeStores = async () => {
            if (initialAccessToken) {
                setAccessToken(initialAccessToken);
            }

            if (initialUserData) {
                setUserData(initialUserData);
                await fetchProfile(initialUserData.id);
            }

            setAuthInitialized(true);
            setUserInitialized(true);
            isInitialized.current = true;
        };

        initializeStores();
    }, [initialAccessToken, initialUserData, setAccessToken, setAuthInitialized, setUserInitialized, setUserData, profiles, fetchProfile]);

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
                title: "Email send",
                description: "Verification link was sent to your address.",
                variant: "success",
                duration: 5000,
            });

        } catch (error) {
            console.error('Error sending verification email:', error);
            toast({
                title: "Error",
                description: "There was an error sending verification code. Try again later.",
                variant: "destructive",
                duration: 5000,
            });
        }
    }, [initialAccessToken]);


    useEffect(() => {
        if (initialAccessToken && initialUserData?.roles?.includes('USER') && !initialUserData?.roles?.includes('VERIFIED')) {
            toast({
                title: "Email verification required",
                description: "Verify your account to gain access to more features.",
                duration: 5000,
                variant: "default",
                action: (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVerificationRequest}
                    >
                        Verify
                    </Button>
                ),
            });
        }
    }, [handleVerificationRequest, initialAccessToken, initialUserData?.roles]);

    useEffect(() => {
        if (initialAccessToken && initialUserData?.roles?.includes('USER')) {
            const refreshTokenInterval = setInterval(async () => {
                // setAuthInitialized(false);
                // setUserInitialized(false);
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
                // finally {
                //     setAuthInitialized(true);
                //     setUserInitialized(true)
                // }
            }, 14 * 60 * 1000);

            return () => clearInterval(refreshTokenInterval);
        }
    }, [clearAuth, clearUserData, initialAccessToken, initialUserData?.roles, setAccessToken]);



    return <>{children}</>;
}