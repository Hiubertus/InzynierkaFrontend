import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ROUTES } from "@/components/Navbar/routes";
import { UserPoints } from './UserPoints';
import { UserAvatar } from './UserAvatar';
import { UserData } from "@/lib/stores/userStore";

interface AuthSectionProps {
    isAuthenticated: boolean;
    userData: UserData | null;
    onLogout: () => Promise<void>;
}

export const AuthSection = ({ isAuthenticated, userData, onLogout }: AuthSectionProps) => {
    if (isAuthenticated && userData) {
        return (
            <div className="flex items-center gap-4">
                <UserPoints points={userData.points} />
                <UserAvatar picture={userData.picture} fullName={userData.fullName} />
                <Button
                    variant="outline"
                    className="ml-4"
                    onClick={onLogout}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <Link href={ROUTES.AUTH}>
            <Button variant="outline" className="ml-4">
                Login
            </Button>
        </Link>
    );
};