"use client"

import React, {useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {useAuthStore} from '@/lib/stores/authStore';
import {Roles, UserData, useUserStore} from '@/lib/stores/userStore';
import {Loader2} from "lucide-react";
import {toast} from "@/hooks/use-toast";

type ComponentType<P> = React.ComponentType<P>;

type AccessRestriction = {
    type: 'auth' | 'public' | 'roles';
    roles?: Roles[];
    restrictionName?: string;
};

const Loader = () => (
    <div className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-50">
        <Loader2
            className="animate-spin text-primary"
            style={{width: '200px', height: '200px', opacity: 0.2, color: '#fc7f03'}}
        />
    </div>
);



const checkAccess = (
    restriction: AccessRestriction,
    accessToken: string | null,
    userData: UserData | null
): boolean => {
    const isAuthenticated = !!accessToken && !!userData;

    switch (restriction.type) {
        case 'auth':
            return isAuthenticated;
        case 'public':
            return !isAuthenticated;
        case 'roles':
            if (!isAuthenticated || !userData || !restriction.roles) return false;

            return restriction.roles.some(requiredRole =>
                userData.roles.includes(requiredRole)
            );
        default:
            return false;
    }
};

const getAccessDeniedMessage = (restriction: AccessRestriction, userData: UserData | null): string => {
    switch (restriction.type) {
        case 'auth':
            return "Musisz być zalogowany, aby uzyskać dostęp do tej strony.";
        case 'public':
            return "Ta strona jest dostępna tylko dla niezalogowanych użytkowników.";
        case 'roles':
            if (!restriction.roles || !restriction.restrictionName) return "Brak wymaganych uprawnień.";

            if (!userData) return "Musisz być zalogowany, aby uzyskać dostęp do tej strony.";

            switch (restriction.restrictionName) {
                case 'VERIFIED':
                    return "Ta strona wymaga weryfikacji konta. Zweryfikuj swój adres email.";
                case 'TEACHER':
                    return "Ta strona jest dostępna tylko dla nauczycieli.";
                case 'ADMIN':
                    return "Ta strona jest dostępna tylko dla administratorów.";
                default:
                    return "Brak wymaganych uprawnień.";
            }
        default:
            return "Brak dostępu do tej strony.";
    }
};

const withAccessControl = <P extends object>(
    WrappedComponent: ComponentType<P>,
    restriction: AccessRestriction
) => {
    return function WithAccessControlComponent(props: P) {
        const router = useRouter();
        const {accessToken, isInitialized: isAuthInitialized} = useAuthStore();
        const {userData, isInitialized: isUserInitialized} = useUserStore();
        const [isFirstMount, setIsFirstMount] = useState(true);
        const lastValidContent = useRef<React.ReactNode>(null);

        const areStoresInitialized = isAuthInitialized && isUserInitialized;
        const hasAccess = checkAccess(restriction, accessToken, userData);

        useEffect(() => {
            setIsFirstMount(false);
        }, []);

        useEffect(() => {
            if (!areStoresInitialized) return;

            if (!hasAccess) {
                const isAuthenticated = !!accessToken && !!userData;
                const redirectPath = isAuthenticated ? '/' : '/auth';

                // Nie pokazujemy toastu dla publicznych stron
                if (restriction.type !== 'public') {
                    toast({
                        title: "Brak dostępu",
                        description: getAccessDeniedMessage(restriction, userData),
                        variant: "destructive",
                        duration: 5000,
                    });
                }

                setTimeout(() => {
                    router.replace(redirectPath);
                }, 100);
            }
        }, [accessToken, userData, hasAccess, areStoresInitialized, router]);

        // Specjalna obsługa dla publicznych stron (np. strona logowania)
        if (restriction.type === 'public') {
            // Jeśli stores są zainicjowane, pokazujemy komponent lub przekierowujemy
            if (areStoresInitialized) {
                if (hasAccess) {
                    return <WrappedComponent {...props} />;
                }
                // Jeśli użytkownik jest zalogowany, przekierowujemy bez pokazywania loadera
                return null;
            }
            // Podczas inicjalizacji pokazujemy loader tylko przy pierwszym montowaniu
            return isFirstMount ? <Loader /> : <WrappedComponent {...props} />;
        }

        // Standardowa logika dla chronionych stron
        if (isFirstMount && (!areStoresInitialized || !hasAccess)) {
            return <Loader/>;
        }

        if (!areStoresInitialized) {
            return (
                <>
                    {lastValidContent.current || <WrappedComponent {...props} />}
                    <Loader/>
                </>
            );
        }

        if (!hasAccess && lastValidContent.current) {
            return (
                <>
                    {lastValidContent.current}
                    <Loader/>
                </>
            );
        }

        if (hasAccess) {
            return <WrappedComponent {...props} />;
        }

        return <Loader/>;
    };
};

export const withProtectedAuth = <P extends object>(Component: ComponentType<P>) =>
    withAccessControl(Component, {
        type: 'auth'
    });

export const withPublicAuth = <P extends object>(Component: ComponentType<P>) =>
    withAccessControl(Component, {
        type: 'public'
    });

export const withVerifiedAuth = <P extends object>(Component: ComponentType<P>) =>
    withAccessControl(Component, {
        type: 'roles',
        roles: ['VERIFIED', 'ADMIN', 'TEACHER'],
        restrictionName: 'VERIFIED'
    });

export const withTeacherAuth = <P extends object>(Component: ComponentType<P>) =>
    withAccessControl(Component, {
        type: 'roles',
        roles: ['ADMIN', 'TEACHER'],
        restrictionName: 'TEACHER'
    });

export const withAdminAuth = <P extends object>(Component: ComponentType<P>) =>
    withAccessControl(Component, {
        type: 'roles',
        roles: ['ADMIN'],
        restrictionName: 'ADMIN'
    });