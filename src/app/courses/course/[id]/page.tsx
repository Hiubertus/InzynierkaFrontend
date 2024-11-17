'use client'

import { useEffect, useState } from 'react'
import { CourseFrontPage } from "@/components/Course/CourseFrontPage"
import useCourseStore from '@/lib/stores/courseStore'
import useProfileStore from '@/lib/stores/profileStore'
import { CourseFrontPageSkeleton } from "@/components/Course/CourseFrontPageSkeleton"

interface CoursePageProps {
    params: {
        id: string
    }
}

export default function CoursePage({ params }: CoursePageProps) {
    const [isLoading, setIsLoading] = useState(true)

    const course = useCourseStore(state =>
        state.courses.find(course => course.id === Number(params.id))
    )

    const owner = useProfileStore(state =>
        course ? state.profiles.find(profile => profile.id === course.ownerId) : null
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <CourseFrontPageSkeleton />
    }

    if (!course || !owner) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">Course not found</h1>
            </div>
        )
    }

    return <CourseFrontPage course={course} owner={owner} />
}