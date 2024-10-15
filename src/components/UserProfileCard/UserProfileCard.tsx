"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import {useAuthStore} from "@/lib/stores/authStore";
import {UserProfileCardSkeleton} from "@/components/UserProfileCard/UserProfileCardSkeleton";

export const UserProfileCard = () => {

    const { user } = useAuthStore()

    if (!user) {
        return <UserProfileCardSkeleton/>
    }

    return (
        <Card className="w-[350px]">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.picture} alt={`Zdjęcie profilowe ${user.fullName}`} />
                    <AvatarFallback>
                        U
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold">{user.fullName}</h2>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm">
                    {user.description || "Brak opisu użytkownika."}
                </p>
                <div className="space-y-2">
                    <h3 className="font-semibold">Osiągnięcia:</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.badges && user.badges.length > 0 ? (
                            user.badges.map((achievement: string, index: number) => (
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
            </CardContent>
        </Card>
    )
}