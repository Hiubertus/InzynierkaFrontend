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
    ownerId: number;
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
    content: (cText | cMedia | cQuiz)[];
}

export interface cText {
    id: number;
    type: 'text';
    text: string;
    order: number;
    fontSize: "small" | "medium" | "large";
    bolder: boolean;
    italics: boolean;
    underline: boolean;
    textColor: string;
}

export interface cMedia {
    id: number;
    type: 'image' | 'video';
    order: number;
    file: File | null;
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm';
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