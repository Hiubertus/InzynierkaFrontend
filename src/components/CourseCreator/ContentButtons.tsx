import { Button } from "@/components/ui/button";
import { FileText, Type, ClipboardList } from "lucide-react";
import React from "react";
import { MediaForm, QuizForm, TextForm } from "@/components/CourseCreator/formSchema";

interface ContentButtonsProps {
    appendContent: (content: TextForm | MediaForm | QuizForm) => void;
}

export const ContentButtons: React.FC<ContentButtonsProps> = ({appendContent}) => {
    return (
        <div className="flex space-x-2 pt-4">
            <Button
                onClick={() => appendContent({
                    type: "text",
                    text: "",
                    fontSize: "small",
                    bolder: false,
                    italics: false,
                    underline: false,
                    textColor: "black"
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
                    file: null,
                    mediaType: 'image/jpeg'
                })}
                variant="outline"
                className="flex items-center"
                type="button"
            >
                <FileText size={18} className="mr-1"/>
                Image
            </Button>
            <Button
                onClick={() => appendContent({
                    type: "video",
                    file: null,
                    mediaType: 'video/mp4'
                })}
                variant="outline"
                className="flex items-center"
                type="button"
            >
                <FileText size={18} className="mr-1"/>
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
        </div>
    );
};