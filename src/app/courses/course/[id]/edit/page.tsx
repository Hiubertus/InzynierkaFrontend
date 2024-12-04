import {withTeacherAuth} from "@/lib/session/withAuth";
import CourseCreator from "@/components/CourseCreator/CourseCreator";

function Page() {
    return <CourseCreator/>
}
export default withTeacherAuth(Page)