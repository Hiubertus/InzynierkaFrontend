'use client'

import {useState, useEffect} from 'react'
import {Input} from "@/components/ui/input"
import {CourseCard} from "@/components/Course/CourseCard"

import useCourseStore from "@/lib/stores/courseStore";
import useProfileStore from "@/lib/stores/profileStore";
import {CourseGrid} from "@/components/Course/CoursesGrid";

export default function Page() {
    const [searchTerm, setSearchTerm] = useState("")
    const {courses, isLoading, error, fetchCourses} = useCourseStore()
    const {profiles} = useProfileStore()

    useEffect(() => {

        const fetchData = async () => {
            try {
                await fetchCourses();
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchData();
    }, [fetchCourses]);

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
                <CourseGrid courses={courses} profiles={profiles} isLoading={isLoading} />
        </div>
    )
}