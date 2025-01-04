"use client"

import {withTeacherAuth} from "@/lib/session/withAuth";
import CourseCreator from "@/components/CourseCreator/CourseCreator";
import {useParams} from "next/navigation";

function Page() {
    const { id } = useParams()
    return <CourseCreator courseId={Number(id)}/>
}
export default withTeacherAuth(Page)