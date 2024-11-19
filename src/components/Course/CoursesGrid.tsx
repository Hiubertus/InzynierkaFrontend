import { CourseCard } from "@/components/Course/CourseCard";
import { CourseCardSkeleton } from "@/components/Course/CourseCardSkeleton";
import { CourseData } from "@/models/front_models/CourseData";
import { ProfileData } from "@/models/front_models/ProfileData";
import { UserData } from "@/lib/stores/userStore";

interface CourseGridProps {
    courses: CourseData[];
    profiles: ProfileData[];
    isLoading?: boolean;
    error: string | null;
    gridType: 'shop' | 'owned' | 'created';
    userData: UserData | null;
}

interface EmptyStateConfig {
    authenticated: string;
    unauthenticated: string;
}

const EMPTY_STATES: Record<'shop' | 'owned' | 'created', EmptyStateConfig> = {
    shop: {
        authenticated: "No courses were found",
        unauthenticated: "No courses were found"
    },
    owned: {
        authenticated: "Buy courses to show them",
        unauthenticated: "Login to see your own courses"
    },
    created: {
        authenticated: "Create courses to see them",
        unauthenticated: "Become a teacher to create courses"
    }
};

type RoleReturn =  'USER' | 'TEACHER' | null

const getRoleForType = (type: 'shop' | 'owned' | 'created'): RoleReturn  => {
    switch (type) {
        case 'owned': return 'USER';
        case 'created': return 'TEACHER';
        default: return null;
    }
};

export const CourseGrid = ({
                               courses,
                               profiles,
                               isLoading,
                               error,
                               gridType,
                               userData
                           }: CourseGridProps) => {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                    <CourseCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                An error has occurred
            </div>
        );
    }

    if (courses.length === 0) {
        const requiredRole: RoleReturn = getRoleForType(gridType);
        const isAuthenticated = requiredRole ? userData?.roles.includes(requiredRole) : true;
        const message = EMPTY_STATES[gridType][isAuthenticated ? 'authenticated' : 'unauthenticated'];

        return (
            <div className="text-center py-8 text-gray-500">
                {message}
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => {
                const ownerProfile = profiles.find(profile => profile.id === course.ownerId);
                return (
                    <CourseCard
                        key={course.id}
                        course={course}
                        userProfile={ownerProfile!}
                    />
                );
            })}
        </div>
    );
};