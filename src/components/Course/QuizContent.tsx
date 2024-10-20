import {cQuiz} from "@/models/CourseData";

export const QuizContent = ({ content }: { content: cQuiz }) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
        {content.quizContent.map((question) => (
            <div key={question.id} className="mb-4">
                <p className="font-semibold mb-2">{question.question}</p>
                {question.answers.map((answer) => (
                    <div key={answer.id} className="flex items-center mb-2">
                        <input
                            type={question.singleAnswer ? "radio" : "checkbox"}
                            id={`question-${question.id}-answer-${answer.id}`}
                            name={`question-${question.id}`}
                            className="mr-2"
                        />
                        <label htmlFor={`question-${question.id}-answer-${answer.id}`}>
                            {answer.answer}
                        </label>
                    </div>
                ))}
            </div>
        ))}
    </div>
);