import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ROUTES } from "@/components/Navbar/routes";
import { UserData } from "@/lib/stores/userStore";
import {PointsComponent} from "@/components/PointsComponent/PointsComponent";
import {AvatarComponent} from "@/components/AvatarComponent/AvatarComponent";
import {ProfileData} from "@/models/front_models/ProfileData";

interface AuthSectionProps {
    isAuthenticated: boolean;
    userData: UserData | null;
    onLogout: () => Promise<void>;
    profileData: ProfileData | undefined;
}

export const AuthSection = ({ isAuthenticated, userData, onLogout, profileData }: AuthSectionProps) => {
    if (isAuthenticated && userData && profileData) {
        return (
            <div className="flex items-center gap-4">
                <PointsComponent points={userData.points} />
                <AvatarComponent userProfile={profileData}/>
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