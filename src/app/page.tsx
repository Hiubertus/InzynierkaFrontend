"use client"

import { CourseCreator} from "@/components/CourseCreator/CourseCreator";
export default function Home() {
    return (
        <div className="container mx-auto p-5 sm:p-7 lg:p-9">
            <CourseCreator/>
        </div>
    );
}