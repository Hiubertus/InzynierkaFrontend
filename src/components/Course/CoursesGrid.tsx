import CourseCard from "@/components/Course/CourseCard";
import {CourseCardSkeleton} from "@/components/Course/CourseCardSkeleton";
import {CourseData} from "@/models/front_models/CourseData";
import {ProfileData} from "@/models/front_models/ProfileData";

interface CourseGridProps {
    courses: CourseData[];
    profiles: ProfileData[];
    isLoading?: boolean;
}

export const CourseGrid = ({ courses, profiles, isLoading }: CourseGridProps) => {
    if (isLoading || !courses.length) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                    <CourseCardSkeleton key={`skeleton-${index}`} />
                ))}
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