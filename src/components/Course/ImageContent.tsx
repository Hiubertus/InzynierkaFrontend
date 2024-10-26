import {cImage} from "@/models/CourseData";

export const ImageContent = ({ content }: { content: cImage }) => (
    <div>
        {content.image ? (<img
            src={URL.createObjectURL(content.image)}
            alt="Course content"
            className="w-full rounded-lg shadow-lg mx-auto"
        />) : <></>}
    </div>

);