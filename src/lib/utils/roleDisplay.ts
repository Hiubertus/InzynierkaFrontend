import { Roles } from "@/lib/stores/userStore";

export const getRoleDisplay = (roles: Roles[]): string => {
    if (roles.includes('ADMIN')) return 'Admin';
    if (roles.includes('TEACHER')) return 'Teacher';
    return 'User';
};