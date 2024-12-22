import React, {useState} from 'react';
import {cQuiz} from "@/models/front_models/CourseData";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";

export const QuizContent = ({ content }: { content: cQuiz }) => {
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});

    const handleAnswerChange = (questionId: number, answerId: number, checked: boolean) => {
        setAnswers(prev => {
            const currentAnswers = prev[questionId] || [];
            if (checked) {
                return {
                    ...prev,
                    [questionId]: [...currentAnswers, answerId]
                };
            } else {
                return {
                    ...prev,
                    [questionId]: currentAnswers.filter(id => id !== answerId)
                };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newFeedback: Record<number, boolean> = {};

        content.quizContent.forEach(question => {
            const userAnswers = answers[question.id] || [];
            const correctAnswers = question.answers
                .filter(answer => answer.isCorrect)
                .map(answer => answer.id);

            if (question.singleAnswer) {
                newFeedback[question.id] =
                    userAnswers.length === 1 &&
                    correctAnswers.includes(userAnswers[0]);
            }

            else {
                newFeedback[question.id] = userAnswers.length === correctAnswers.length &&
                    userAnswers.every(answer => correctAnswers.includes(answer));
            }
        });

        setFeedback(newFeedback);
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setFeedback({});
    };

    return (
        <Card className="bg-gray-100 p-4 rounded-lg shadow">
            <form onSubmit={handleSubmit}>
                {content.quizContent.map((question) => (
                    <div key={question.id} className="mb-6">
                        <p className="font-semibold mb-2">{question.question}</p>
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="flex items-center mb-2">
                                <input
                                    type={question.singleAnswer ? "radio" : "checkbox"}
                                    id={`question-${question.id}-answer-${answer.id}`}
                                    name={`question-${question.id}`}
                                    className="mr-2"
                                    onChange={(e) => handleAnswerChange(
                                        question.id,
                                        answer.id,
                                        e.target.checked
                                    )}
                                    checked={
                                        (answers[question.id] || []).includes(answer.id)
                                    }
                                />
                                <label
                                    htmlFor={`question-${question.id}-answer-${answer.id}`}
                                    className="flex-grow"
                                >
                                    {answer.answer}
                                </label>
                            </div>
                        ))}
                        {submitted && (
                            <Alert className={`mt-2 ${
                                feedback[question.id] ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                <AlertDescription>
                                    {feedback[question.id]
                                        ? 'Poprawna odpowiedź!'
                                        : 'Niepoprawna odpowiedź. Spróbuj jeszcze raz.'}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                ))}
                <div className="mt-6 flex gap-4">
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        Sprawdź odpowiedzi
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleReset}
                    >
                        Reset formularza
                    </Button>
                </div>
            </form>
        </Card>
    );
};