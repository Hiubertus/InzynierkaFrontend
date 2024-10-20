"use client"

// import {UserProfileCard} from "@/components";
// import {Course} from "@/components/Course/Course";
// import {courseTest} from "@/components/Course/courseTest";

import { CourseCreator} from "@/components/CourseCreator/CourseCreator";
export default function Home() {
    return (
        <div className="container mx-auto p-5 sm:p-7 lg:p-9">
            {/*<h1 className="text-2xl font-bold mb-4">Stan autentykacji</h1>*/}
            {/*<UserProfileCard/>*/}
            {/*<Course course={courseTest}/>*/}
            <CourseCreator/>
        </div>
    );
}