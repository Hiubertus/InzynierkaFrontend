import {CourseData} from "@/models/front_models/CourseData";

export async function getCourseById(id: string): Promise<CourseData> {
    const response = await fetch(`/api/courses/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch course')
    }

    return response.json()
}