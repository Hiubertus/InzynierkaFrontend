import { Button } from "@/components/ui/button";
import { FileText, Type, ClipboardList } from "lucide-react";
import { MediaForm, QuizForm, TextForm } from "@/components/CourseCreator/formSchema";
import { FC } from "react";

interface ContentButtonsProps {
    appendContent: (content: TextForm | MediaForm | QuizForm) => void;
    courseId?: number;
}

export const ContentButtons: FC<ContentButtonsProps> = ({ appendContent, courseId }) => {
    const handleAppendText = () => {
        const textContent: TextForm = {
            type: "text",
            text: "",
            fontSize: "medium",
            bolder: false,
            italics: false,
            underline: false,
            textColor: "#000000"
        };

        if (courseId) {
            appendContent({
                ...textContent,
                id: null,
                deleted: false
            });
        } else {
            appendContent(textContent);
        }
    };

    const handleAppendImage = () => {
        const imageContent: MediaForm = {
            type: "image",
            file: null,
            mediaType: 'image/jpeg'
        };

        if (courseId) {
            appendContent({
                ...imageContent,
                id: null,
                deleted: false,
                updateFile: false
            });
        } else {
            appendContent(imageContent);
        }
    };

    const handleAppendVideo = () => {
        const videoContent: MediaForm = {
            type: "video",
            file: null,
            mediaType: 'video/mp4'
        };

        if (courseId) {
            appendContent({
                ...videoContent,
                id: null,
                deleted: false,
                updateFile: false
            });
        } else {
            appendContent(videoContent);
        }
    };

    const handleAppendQuiz = () => {
        const quizContent: QuizForm = {
            type: "quiz",
            quizContent: [{
                question: "New Question",
                singleAnswer: true,
                answers: [
                    {
                        answer: "Answer 1",
                        isCorrect: false,
                    },
                    {
                        answer: "Answer 2",
                        isCorrect: false,
                    }
                ]
            }]
        };

        if (courseId) {
            appendContent({
                ...quizContent,
                id: null,
                deleted: false,
                quizContent: [{
                    id: null,
                    question: "New Question",
                    singleAnswer: true,
                    deleted: false,
                    answers: [
                        {
                            id: null,
                            answer: "Answer 1",
                            isCorrect: false,
                            deleted: false
                        },
                        {
                            id: null,
                            answer: "Answer 2",
                            isCorrect: false,
                            deleted: false
                        }
                    ]
                }]
            });
        } else {
            appendContent(quizContent);
        }
    };

    return (
        <div className="flex space-x-2 pt-4">
            <Button
                onClick={handleAppendText}
                variant="outline"
                className="flex items-center"
                type="button"
            >
                <Type size={18} className="mr-1"/>
                Text
            </Button>
            <Button
                onClick={handleAppendImage}
                variant="outline"
                className="flex items-center"
                type="button"
            >
                <FileText size={18} className="mr-1"/>
                Image
            </Button>
            <Button
                onClick={handleAppendVideo}
                variant="outline"
                className="flex items-center"
                type="button"
            >
                <FileText size={18} className="mr-1"/>
                Video
            </Button>
            <Button
                onClick={handleAppendQuiz}
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