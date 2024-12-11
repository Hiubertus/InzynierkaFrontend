"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { ProfileData } from "@/models/front_models/ProfileData";
import { getRoleDisplay } from "@/lib/utils/roleDisplay";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/components/Navbar/routes";

interface Props {
    userProfile: ProfileData;
    className?: string;
    isClickable?: boolean;
}

export const UserProfileSmall = ({ userProfile, className, isClickable = false }: Props) => {
    const CardComponent = (
        <Card className={cn(
            "w-[350px]",
            isClickable && "cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]",
            className
        )}>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    {userProfile.picture ? (
                        <AvatarImage
                            src={URL.createObjectURL(userProfile.picture)}
                            alt={`Zdjęcie profilowe ${userProfile.fullName}`}
                        />
                    ) : (
                        <AvatarFallback>
                            {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{userProfile.fullName}</h2>
                    <Badge variant="outline" className="text-sm">
                        {getRoleDisplay(userProfile.roles)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-xs text-muted-foreground border-t pt-2">
                    Member since {formatDate(userProfile.createdAt)}
                </div>

                <p className="text-sm">
                    {userProfile.description || "Brak opisu użytkownika."}
                </p>

                {userProfile.badgesVisible && (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Osiągnięcia:</h3>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.badges && userProfile.badges.length > 0 ? (
                                userProfile.badges.map((achievement: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        <Trophy className="h-3 w-3" />
                                        {achievement}
                                    </Badge>
                                ))
                            ) : (
                                <p>Brak osiągnięć do wyświetlenia.</p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (isClickable) {
        const profileRoute = ROUTES.PROFILE.replace('{id}', userProfile.id.toString());
        return (
            <Link href={profileRoute} className="block">
                {CardComponent}
            </Link>
        );
    }

    return CardComponent;
};