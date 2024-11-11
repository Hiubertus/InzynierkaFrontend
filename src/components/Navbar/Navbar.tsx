"use client"

import { useAuthStore } from "@/lib/stores/authStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useRouter } from 'next/navigation';
import { logout } from "@/lib/session/auth/logout";
import { NavLinks } from './NavLinks';
import { CartButton } from './CartButton';
import { AuthSection } from './AuthSection';
import { ROUTES } from "@/components/Navbar/routes";

export const Navbar = () => {
    const { accessToken, setAccessToken, clearAuth, setInitialized: setAuthInitialized  } = useAuthStore();
    const { userData, clearUserData, setInitialized: setUserInitialized  } = useUserStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success) {
                setAuthInitialized(false);
                setUserInitialized(false);

                router.push(ROUTES.HOME);
                setAccessToken(null);
                clearUserData();
                clearAuth();

            } else {
                console.error('Logout failed:', result.error);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 left-0 z-50">
            <div className="container mx-auto px-5 sm:px-7 lg:px-9">
                <div className="flex items-center justify-between h-16">
                    <NavLinks />
                    <div className="flex items-center space-x-4">
                        <CartButton />
                        <AuthSection
                            isAuthenticated={!!accessToken}
                            userData={userData}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};