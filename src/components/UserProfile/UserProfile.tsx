"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trophy, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileSkeleton } from "@/components/UserProfile/UserProfileSkeleton";
import useProfileStore from "@/lib/stores/profileStore";
import { useRouter, useParams } from 'next/navigation';
import { ROUTES } from "@/components/Navbar/routes";
import { useUserStore } from "@/lib/stores/userStore";

export const UserProfile = () => {
    const router = useRouter();
    const params = useParams();
    const profileId = Number(params.id);
    const { profiles } = useProfileStore();
    const { userData } = useUserStore();
    const userProfile = profiles.find(profile => profile.id === profileId);

    if (!userProfile) return <UserProfileSkeleton />;

    const isOwnProfile = userData?.id === profileId;

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-24 w-24">
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
                    <div className="text-center sm:text-left w-full flex justify-between items-start">
                        <h2 className="text-3xl font-bold mb-2">{userProfile.fullName}</h2>
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => router.push(ROUTES.PROFILE_EDIT)}
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <p className="text-muted-foreground">
                            {userProfile.description || "No description provided."}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Achievements:</h3>
                        {userProfile.badgesVisible ? (
                            <div className="flex flex-wrap gap-2">
                                {userProfile.badges.length > 0 ? (
                                    userProfile.badges.map((achievement, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 text-sm py-1 px-2"
                                        >
                                            <Trophy className="h-4 w-4"/>
                                            {achievement}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">
                                        No achievements yet!
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                Achievements are hidden
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};