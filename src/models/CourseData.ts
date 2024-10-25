export interface CourseData {
    id: number;
    name: string;
    banner: File | null;
    price: number;
    review: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    reviewNumber: number;
    userProfileID: number;
    description: string;
    chapters: ChapterData[];
}

export interface ChapterData {
    id: number;
    order: number;
    name: string;
    review: number;
    reviewNumber: number;
    subchapters: SubChapterData[];
}

export interface SubChapterData {
    id: number;
    order: number;
    name: string;
    completed: boolean;
    content: (cText | cVideo | cImage | cQuiz)[];
}

export interface cText {
    id: number;
    type: 'text';
    text: string;
    order: number;
    fontSize: "small" | "medium" | "large";
    fontWeight: "normal" | "bold";
    italics: boolean;
    emphasis: boolean;
}

export interface cVideo {
    id: number;
    type: 'video';
    order: number;
    video: File | null;
}

export interface cImage {
    id: number;
    type: 'image';
    order: number;
    image: File | null
}

export interface cQuiz {
    id: number;
    type: 'quiz';
    order: number;
    quizContent: QuizForm[];
}

export interface QuizForm {
    id: number;
    question: string;
    order: number;
    answers: Answer[];
    singleAnswer: boolean;
}

export interface Answer {
    id: number;
    order: number;
    answer: string;
    isCorrect: boolean;
}