"use client"

import { ROUTES } from "@/components/Navbar/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProfileData } from "@/models/front_models/ProfileData";
import Link from "next/link";
import {UserProfileSmall} from "@/components/UserProfile/UserProfileSmall";

interface Props {
    userProfile: ProfileData;
    isLink?: boolean;
    onClick?: () => void;
}

export const AvatarComponent = ({ userProfile, isLink = true, onClick }: Props) => {

    const AvatarContent = (
        <Avatar className="cursor-pointer static">
            {userProfile.picture ? (
                <AvatarImage
                    src={URL.createObjectURL(userProfile.picture)}
                    alt={`Profile picture of ${userProfile.fullName}`}
                />
            ) : (
                <AvatarFallback>
                    {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
            )}
        </Avatar>
    );

    const TooltipWrapper = ({ children }: { children: React.ReactNode }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-0">
                    <UserProfileSmall userProfile={userProfile} className="w-[350px]" />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    if (!isLink) {
        return (
            <TooltipWrapper>
                <div onClick={onClick}>
                    {AvatarContent}
                </div>
            </TooltipWrapper>
        );
    }

    const profileRoute = ROUTES.PROFILE.replace('{id}', userProfile.id.toString());

    return (
        <TooltipWrapper>
            <Link href={profileRoute}>
                {AvatarContent}
            </Link>
        </TooltipWrapper>
    );
};