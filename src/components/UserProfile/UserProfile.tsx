"use client"

import { UserProfilePageSkeleton} from "@/components/UserProfile/UserProfilePageSkeleton";
import { UserProfilePage } from "@/components/UserProfile/UserProfilePage";
import {useAuthStore} from "@/lib/stores/authStore";

export const UserProfile = () => {
    const { user, loading, updateUserField } = useAuthStore();

    if (loading || !user) {
        return <UserProfilePageSkeleton />;
    }

    return <UserProfilePage user={user} updateUserField={updateUserField} />;
};