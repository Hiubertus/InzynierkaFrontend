"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useCourseStore from "@/lib/stores/courseStore"
import { withProtectedAuth } from "@/lib/session/withAuth"
import { Course } from '@/components/Course/Course'
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/stores/authStore"

function Page() {
    const { id } = useParams()
    const router = useRouter()
    const [isDataFetched, setIsDataFetched] = useState(false)
    const { accessToken, isInitialized: isAuthInitialized } = useAuthStore()
    const { toast } = useToast()
    const {
        courses,
        isLoading,
        fetchSingleCourse
    } = useCourseStore()

    useEffect(() => {
        const initializePage = async () => {
            if (!id || !isAuthInitialized || isDataFetched) {
                return
            }

            try {
                const existingCourse = courses.find(c => c.id === Number(id))
                if (!existingCourse) {
                    await fetchSingleCourse(Number(id), accessToken)
                }
                setIsDataFetched(true)
            } catch (error) {
                console.error('Error initializing course page:', error)
                router.push('/')
            }
        }

        initializePage()
    }, [id, courses, fetchSingleCourse, accessToken, router, toast, isAuthInitialized, isDataFetched])

    const course = useCourseStore(state => {
        const courseId = Number(id);

        const ownedCourse = state.ownedCourses.find(course => course.id === courseId);
        if (ownedCourse) return ownedCourse;

        const createdCourse = state.createdCourses.find(course => course.id === courseId);
        if (createdCourse) return createdCourse;

        const shopCourse = state.shopCourses.find(course => course.id === courseId);
        if (shopCourse) return shopCourse;

        return state.courses.find(course => course.id === courseId);
    });

    useEffect(() => {
        if (course && course.relationshipType !== 'PURCHASED') {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have access to this course"
            })
            router.push('/')
        }
    }, [course, router, toast])

    if (!course || course.relationshipType !== 'PURCHASED') {
        return null
    }

    return (
        <Course
            course={course}
            isLoading={isLoading}
        />
    )
}

export default withProtectedAuth(Page)