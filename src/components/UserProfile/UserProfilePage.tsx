
import React, {useEffect, useRef, useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {Camera, Trophy} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Eye, EyeOff } from "lucide-react";

import {EditableField} from "@/components/UserProfile/EditableField";
import {EmailForm} from "@/components/UserProfile/EmailForm";
import {PasswordForm} from "@/components/UserProfile/PasswordForm";
import {UserData} from "@/models/UserData";


interface UserProfilePageProps {
    user: UserData;
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
                                                                    user,
                                                                    updateUserField
                                                                }) => {
    const [achievementsVisible, setAchievementsVisible] = useState(user?.achievementsVisible ?? true);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingChanges, setPendingChanges] = useState<Partial<UserData>>({});

    useEffect(() => {
        if (user) {
            setAchievementsVisible(user.achievementsVisible);
        }
    }, [user]);

    const toggleAchievementsVisibility = (visible: boolean) => {
        setAchievementsVisible(visible);
        setPendingChanges({ ...pendingChanges, achievementsVisible: visible });
    };

    const updateUserData = async <K extends keyof UserData>(field: K, value: UserData[K]) => {
        setPendingChanges({ ...pendingChanges, [field]: value });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateUserData('picture', base64String).then();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitAllChanges = async () => {
        try {

            Object.entries(pendingChanges).forEach(([key, value]) => {
                updateUserField(key as keyof UserData, value);
            });

            setPendingChanges({});

            console.log('All changes submitted successfully');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHoveringAvatar(true)}
                        onMouseLeave={() => setIsHoveringAvatar(false)}
                        onClick={handleAvatarClick}
                    >
                        <Avatar className="h-24 w-24 cursor-pointer">
                            <AvatarImage src={pendingChanges.picture || user.picture} alt={`Profile picture of ${user.fullName}`} />
                            <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {isHoveringAvatar && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <Camera className="text-white" />
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <div className="text-center sm:text-left w-full">
                        <h2 className="text-3xl font-bold mb-2">
                            <EditableField
                                value={pendingChanges.fullName || user.fullName}
                                onSave={(value) => updateUserData('fullName', value)}
                                fieldName="fullName"
                                inputType="input"
                            />
                        </h2>
                        <p className="text-lg text-muted-foreground">{user.email}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <EditableField
                            value={pendingChanges.description || user.description}
                            onSave={(value) => updateUserData('description', value)}
                            fieldName="description"
                            inputType="textarea"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">Achievements:</h3>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={achievementsVisible}
                                    onCheckedChange={toggleAchievementsVisibility}
                                    id="achievements-visibility"
                                />
                                <label htmlFor="achievements-visibility" className="text-sm text-muted-foreground cursor-pointer">
                                    {achievementsVisible ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </label>
                            </div>
                        </div>
                        {achievementsVisible && (
                            <div className="flex flex-wrap gap-2">
                                {(user.badges  && user.badges.length > 0) ? (
                                    user.badges.map((achievement, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1 text-sm py-1 px-2">
                                            <Trophy className="h-4 w-4" />
                                            {achievement}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No achievements yet. Keep working to earn some!</p>
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmitAllChanges}
                        className="w-full mb-6"
                        disabled={Object.keys(pendingChanges).length === 0}
                    >
                        Save All Changes
                    </Button>

                    <h3 className="text-2xl font-bold mb-4">Account Settings</h3>

                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Change email</TabsTrigger>
                            <TabsTrigger value="password">Change password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email">
                            <EmailForm user={user} setUser={(updatedUser) => updateUserField('email', updatedUser.email)} />
                        </TabsContent>
                        <TabsContent value="password">
                            <PasswordForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
