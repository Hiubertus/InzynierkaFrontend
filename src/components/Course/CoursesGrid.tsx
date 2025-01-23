import React from 'react';
import { CourseCard } from "@/components/Course/CourseCard";
import { CourseCardSkeleton } from "@/components/Course/CourseCardSkeleton";
import { CourseData } from "@/models/front_models/CourseData";
import { ProfileData } from "@/models/front_models/ProfileData";
import { UserData } from "@/lib/stores/userStore";
import { useCourseStore } from "@/lib/stores/courseStore";
import { SearchComponent } from "./SearchComponent";

interface CourseGridProps {
    courses: CourseData[];
    profiles: ProfileData[];
    isLoading?: boolean;
    error: string | null;
    gridType: 'shop' | 'owned' | 'created' | 'teacherCourses';
    userData: UserData | null;
    showSearch?: boolean;
}

interface EmptyStateConfig {
    authenticated: string;
    unauthenticated: string;
}

const EMPTY_STATES: Record<'shop' | 'owned' | 'created' | 'teacherCourses', EmptyStateConfig> = {
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
    },
    teacherCourses: {
        authenticated: "This teacher doesn't have any courses",
        unauthenticated: "This teacher doesn't have any courses"
    }
};

type RoleReturn = 'USER' | 'TEACHER' | null;

const getRoleForType = (type: 'shop' | 'owned' | 'created' | 'teacherCourses'): RoleReturn => {
    switch (type) {
        case 'owned': return 'USER';
        case 'created': return 'TEACHER';
        case 'teacherCourses': return null;
        default: return null;
    }
};

export const CourseGrid = ({
                               courses,
                               profiles,
                               isLoading,
                               error,
                               gridType,
                               userData,
                               showSearch = true,
                           }: CourseGridProps) => {
    const fetchShopCourses = useCourseStore(state => state.fetchShopCourses);
    const fetchOwnedCourses = useCourseStore(state => state.fetchOwnedCourses);
    const fetchCreatedCourses = useCourseStore(state => state.fetchCreatedCourses);

    const handleSearch = (search: string, tag: string | undefined) => {
        switch (gridType) {
            case 'shop':
                fetchShopCourses(0, 9, search, tag);
                break;
            case 'owned':
                fetchOwnedCourses(0, 9, search, tag);
                break;
            case 'created':
                fetchCreatedCourses(undefined, 0, 9, search, tag);
                break;
        }
    };

    return (
        <div>
            {showSearch && (
                <SearchComponent
                    onSearch={handleSearch}
                />
            )}

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <CourseCardSkeleton key={`skeleton-${index}`} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">
                    An error has occurred
                </div>
            ) : courses.length === 0 ? (
                <div>
                    {(() => {
                        const requiredRole: RoleReturn = getRoleForType(gridType);
                        const isAuthenticated = requiredRole ? userData?.roles.includes(requiredRole) : true;
                        const message = EMPTY_STATES[gridType][isAuthenticated ? 'authenticated' : 'unauthenticated'];

                        return (
                            <div className="text-center py-8 text-gray-500">
                                {message}
                            </div>
                        );
                    })()}
                </div>
            ) : (
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
            )}
        </div>
    );
};