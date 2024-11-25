"use client"

import Link from "next/link";
import { ROUTES } from "@/components/Navbar/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { AvatarTooltip } from "@/components/AvatarComponent/AvatarTooltip";
import { ProfileData } from "@/models/front_models/ProfileData";

interface Props {
    userProfile: ProfileData;
}

export const AvatarComponent = ({ userProfile }: Props) => {
    const profileRoute = ROUTES.PROFILE.replace('{id}', userProfile.id.toString());

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={profileRoute}>
                        <Avatar className="cursor-pointer">
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
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-0">
                    <AvatarTooltip userProfile={userProfile} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};