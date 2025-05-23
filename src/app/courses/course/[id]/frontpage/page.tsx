'use client'

import { useEffect, useState } from 'react'
import { CourseFrontPage } from "@/components/Course/CourseFrontPage"
import { useCourseStore } from '@/lib/stores/courseStore'
import { useProfileStore } from '@/lib/stores/profileStore'
import { CourseFrontPageSkeleton } from "@/components/Course/CourseFrontPageSkeleton"
import { useAuthStore } from "@/lib/stores/authStore"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChapterAccordionSkeleton} from "@/components/Course/ChapterAccordionSkeleton";
import {ChapterAccordion} from "@/components/Course/ChapterAccordion";
import {ReviewSkeleton} from "@/components/Review/ReviewSkeleton";
import {ReviewList} from "@/components/Review/ReviewList";

interface CoursePageProps {
    params: {
        id: string
    }
}

export default function CoursePage({ params }: CoursePageProps) {
    const { accessToken, isInitialized: isCourseInitialized } = useAuthStore()
    const [ isDataFetched, setIsDataFetched] = useState(false)
    const { fetchSingleCourse, isLoading } = useCourseStore()

    const course = useCourseStore(state => {
        const courseId = Number(params.id);

        const ownedCourse = state.ownedCourses.find(course => course.id === courseId);
        if (ownedCourse) return ownedCourse;

        const createdCourse = state.createdCourses.find(course => course.id === courseId);
        if (createdCourse) return createdCourse;

        const shopCourse = state.shopCourses.find(course => course.id === courseId);
        if (shopCourse) return shopCourse;
        
        return state.courses.find(course => course.id === courseId);
    });

    const owner = useProfileStore(state =>
        course ? state.profiles.find(profile => profile.id === course.ownerId) : null
    )

    useEffect(() => {
        if (!isDataFetched && isCourseInitialized) {
            fetchSingleCourse(Number(params.id), accessToken)
            setIsDataFetched(true)
        }
    }, [params.id, accessToken, fetchSingleCourse, isDataFetched, isCourseInitialized])


    if (isLoading && !course || !owner) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <CourseFrontPageSkeleton />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChapterAccordionSkeleton />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReviewSkeleton />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!course || !owner) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">Course not found</h1>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <CourseFrontPage course={course} owner={owner}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChapterAccordion chapters={course.chapters} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewList
                            contentId={course.id}
                            type="course"
                            ownerId={owner.id}
                            relationshipType={course.relationshipType}
                            isReadyForReviews={isCourseInitialized}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}