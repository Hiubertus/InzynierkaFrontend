import {cVideo} from "@/models/CourseData";

export const VideoContent = ({content}: { content: cVideo }) => (
    <div>
        {content.video ?
            (<video className="w-full h-[50vh] bg-black rounded-lg shadow-lg" controls>
                <source src={URL.createObjectURL(content.video)} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>) : (<></>)}
    </div>

);