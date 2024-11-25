import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Trophy, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { EditableField } from "@/components/UserProfile/EditableField";
import {UserData} from "@/lib/stores/userStore";
import { updateUserProfile } from "@/lib/session/userData/updateUserProfile";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {EmailForm} from "@/components/UserProfile/EmailForm";
import {PasswordForm} from "@/components/UserProfile/PasswordForm";

type PendingChanges = {
    fullName?: string;
    description?: string;
    badgesVisible?: boolean;
    picture?: File;
};

type Props = {
    accessToken: string;
    userData: UserData;
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;

}

export const UserProfileEditPage = ({accessToken,  userData  ,updateUserField}: Props) => {
    const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!userData || !accessToken) return null;

    const handleChange = <T extends keyof PendingChanges>(field: T, value: PendingChanges[T]) => {
        setPendingChanges(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = async () => {
        if (Object.keys(pendingChanges).length === 0) return;

        try {
            setIsSaving(true);
            const formData = new FormData();

            Object.entries(pendingChanges).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'picture') {
                        formData.append('picture', value as File);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            await updateUserProfile(formData, accessToken);

            Object.entries(pendingChanges).forEach(([key, value]) => {
                updateUserField(key as keyof UserData, value);
            });

            setPendingChanges({});
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleChange('picture', file);
        }
    };

    const getAvatarSrc = () => {
        const picture = pendingChanges.picture || userData.picture;
        if (!picture) return undefined;
        return URL.createObjectURL(picture);
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
                            {(userData.picture || pendingChanges.picture) ? (
                                <AvatarImage
                                    src={getAvatarSrc()}
                                    alt={`Profile picture of ${userData.fullName}`}
                                />
                            ) : (
                                <AvatarFallback>
                                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        {isHoveringAvatar && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <Camera className="text-white"/>
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
                                value={pendingChanges.fullName ?? userData.fullName}
                                onSave={(value) => handleChange('fullName', value)}
                                fieldName="fullName"
                                inputType="input"
                            />
                        </h2>
                        <p className="text-lg text-muted-foreground">{userData.email}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <EditableField
                            value={pendingChanges.description ?? userData.description}
                            onSave={(value) => handleChange('description', value)}
                            fieldName="description"
                            inputType="textarea"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">Achievements:</h3>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={pendingChanges.badgesVisible ?? userData.badgesVisible}
                                    onCheckedChange={(visible) => handleChange('badgesVisible', visible)}
                                    id="achievements-visibility"
                                />
                                <label
                                    htmlFor="achievements-visibility"
                                    className="text-sm text-muted-foreground cursor-pointer"
                                >
                                    {userData.badgesVisible ? (
                                        <Eye className="h-4 w-4"/>
                                    ) : (
                                        <EyeOff className="h-4 w-4"/>
                                    )}
                                </label>
                            </div>
                        </div>
                        {userData.badgesVisible && (
                            <div className="flex flex-wrap gap-2">
                                {userData.badges.length > 0 ? (
                                    userData.badges.map((achievement, index) => (
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
                                        No achievements yet. Keep working to earn some!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {Object.keys(pendingChanges).length > 0 && (
                        <Button
                            onClick={handleSaveChanges}
                            className="w-full"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                    <div className="mt-8">
                        <Tabs defaultValue="email" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="email">Change Email</TabsTrigger>
                                <TabsTrigger value="password">Change Password</TabsTrigger>
                            </TabsList>
                            <TabsContent value="email" className="mt-4">
                                <EmailForm
                                    email={userData.email}
                                    accessToken={accessToken}
                                />
                            </TabsContent>
                            <TabsContent value="password" className="mt-4">
                                <PasswordForm
                                    accessToken={accessToken}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};