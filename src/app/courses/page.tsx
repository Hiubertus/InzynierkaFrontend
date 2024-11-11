'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { CourseCard} from "@/components/Course/CourseCard"
import {CourseData} from "@/models/CourseData";

const courses = [
    {
        id: 1,
        name: "Introduction to React",
        description: "Learn the basics of React development",
        price: 49.99,
        review: 4.5,
        reviewNumber: 120,
        createdAt: new Date("2023-01-15"),
        tags: ["React", "JavaScript", "Web Development"],

    },
    {
        id: 2,
        name: "Advanced TypeScript",
        description: "Master TypeScript for large-scale applications",
        price: 79.99,
        review: 4.8,
        reviewNumber: 85,
        createdAt: new Date("2023-03-22"),
        tags: ["TypeScript", "JavaScript", "Programming"],

    },
]

export default function Page() {
    const [searchTerm, setSearchTerm] = useState("")

    // const filteredCourses = courses.filter(course =>
    //     course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    // )

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/*{courses.map(course => (*/}
                {/*    <CourseCard key={course.id} course={course}  userProfile=/>*/}
                {/*))}*/}
            </div>
        </div>
    )
}