"use client"

import CourseCreator from "@/components/CourseCreator/CourseCreator";
import {withProtectedAuth} from "@/lib/session/withAuth";

function Page() {
    return (
        <CourseCreator />
    )
}

export default withProtectedAuth(Page)