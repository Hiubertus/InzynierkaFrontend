"use client"

import CourseCreator from "@/components/CourseCreator/CourseCreator";
import {withTeacherAuth} from "@/lib/session/withAuth";

function Page() {
    return (
        <CourseCreator />
    )
}

export default withTeacherAuth(Page)