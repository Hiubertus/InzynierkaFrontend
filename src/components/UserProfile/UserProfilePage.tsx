import React, {useEffect, useRef, useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {Camera, Trophy} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";
import {EditableField} from "@/components/UserProfile/EditableField";
import {Session} from "@/lib/session/session";

type PendingChanges = Partial<Pick<Session,
    'fullName' |
    'picture' |
    'description' |
    'badgesVisible'
>>;

type UserProfilePageProps = {
    session: Session;
    updateUserField: (changes: Partial<Session>) => Promise<void>;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
                                                                    session,
                                                                    updateUserField
                                                                }) => {
    const [achievementsVisible, setAchievementsVisible] = useState<boolean>(session.badgesVisible);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState<boolean>(false);
    const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setAchievementsVisible(session.badgesVisible);
    }, [session]);

    const handleChange = (field: keyof PendingChanges, value: Session[keyof Session]) => {
        setPendingChanges(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        if (Object.keys(pendingChanges).length === 0) return;

        try {
            setIsSaving(true);
            await updateUserField(pendingChanges);
            setPendingChanges({});
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleAchievementsVisibility = (visible: boolean) => {
        setAchievementsVisible(visible);
        handleChange('badgesVisible', visible);
    };

    const handleAvatarClick = (): void => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                handleChange('picture', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const hasChanges = Object.keys(pendingChanges).length > 0;

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
                            <AvatarImage
                                src={pendingChanges.picture || session.picture}
                                alt={`Profile picture of ${session.fullName}`}
                            />
                            <AvatarFallback>
                                {session.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
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
                                value={pendingChanges.fullName || session.fullName}
                                onSave={(value) => handleChange('fullName', value)}
                                fieldName="fullName"
                                inputType="input"
                            />
                        </h2>
                        <p className="text-lg text-muted-foreground">{session.email}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <EditableField
                            value={pendingChanges.description || session.description}
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
                                    checked={achievementsVisible}
                                    onCheckedChange={toggleAchievementsVisibility}
                                    id="achievements-visibility"
                                />
                                <label
                                    htmlFor="achievements-visibility"
                                    className="text-sm text-muted-foreground cursor-pointer"
                                >
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
                                {session.badges.length > 0 ? (
                                    session.badges.map((achievement, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 text-sm py-1 px-2"
                                        >
                                            <Trophy className="h-4 w-4" />
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

                    {hasChanges && (
                        <Button
                            onClick={handleSaveChanges}
                            className="w-full"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};