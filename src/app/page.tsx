"use client"

import { useEffect } from 'react'
import { useCourseStore } from '@/lib/stores/courseStore'
import { useProfileStore } from '@/lib/stores/profileStore'
import { CourseCard} from "@/components/Course/CourseCard";
import { UserProfileSmall } from '@/components/UserProfile/UserProfileSmall'
import { CourseCardSkeleton} from "@/components/Course/CourseCardSkeleton";
import { UserProfileSmallSkeleton } from '@/components/UserProfile/UserProfileSmallSkeleton'

export default function Home() {
    const { courses, fetchBestCourses, isLoading: coursesLoading } = useCourseStore()
    const { profiles,getBestTeacherProfiles, fetchBestTeachers, isLoading: profilesLoading } = useProfileStore()

    useEffect(() => {
        fetchBestCourses()
        fetchBestTeachers()
    }, [fetchBestCourses, fetchBestTeachers])

    const bestTeachers = getBestTeacherProfiles()

    return (
        <div className="container mx-auto py-8 space-y-8">
            <section>
                <h2 className="text-3xl font-bold mb-6">Najlepsi nauczyciele</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profilesLoading ? (
                        <>
                            <UserProfileSmallSkeleton />
                            <UserProfileSmallSkeleton />
                            <UserProfileSmallSkeleton />
                        </>
                    ) : (
                        bestTeachers.slice(0, 3).map((profile) => (
                            <UserProfileSmall
                                key={profile.id}
                                userProfile={profile}
                                className="w-full"
                                isClickable={true}
                            />
                        ))
                    )}
                </div>
            </section>


            <section>
                <h2 className="text-3xl font-bold mb-6">Polecane kursy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coursesLoading ? (
                        <>
                            <CourseCardSkeleton/>
                            <CourseCardSkeleton/>
                            <CourseCardSkeleton/>
                        </>
                    ) : (
                        courses.slice(0, 3).map((course) => {
                            const courseOwner = profiles.find(profile => profile.id === course.ownerId)
                            if (!courseOwner) return null

                            return (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    userProfile={courseOwner}
                                />
                            )
                        })
                    )}
                </div>
            </section>
        </div>
    )
}