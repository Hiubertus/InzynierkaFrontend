import {Button} from "@/components/ui/button";
import {Camera, ClipboardList, Film, Type} from "lucide-react";
import React from "react";
import {ImageForm, QuizForm, TextForm, VideoForm} from "@/components/CourseCreator/formSchema";


interface ContentButtonsProps {
    appendContent: (content: TextForm | ImageForm | VideoForm | QuizForm) => void;
}

export const ContentButtons: React.FC<ContentButtonsProps> = ({appendContent}) => {
    return (<div className="flex space-x-2 pt-4">
        <Button
            onClick={() => appendContent({
                type: "text",
                text: "Add Text",
                fontSize: "small",
                bolder: false,
                italics: false,
                underline: false
            })}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Type size={18} className="mr-1"/>
            Text
        </Button>
        <Button
            onClick={() => appendContent({
                type: "image",
                image: null
            })}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Camera size={18} className="mr-1"/>
            Image
        </Button>
        <Button
            onClick={() => appendContent({
                type: "video",
                video: null
            })}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <Film size={18} className="mr-1"/>
            Video
        </Button>
        <Button
            onClick={() => appendContent({
                type: "quiz",
                quizContent: [{
                    question: "Question 1",
                    singleAnswer: true,
                    answers: [
                        {
                            answer: "Answer 1",
                            isCorrect: false,
                        },
                        {
                            answer: "Answer 2",
                            isCorrect: false,
                        },
                    ]
                }]
            })}
            variant="outline"
            className="flex items-center"
            type="button"
        >
            <ClipboardList size={18} className="mr-1"/>
            Quiz
        </Button>
    </div>)
}