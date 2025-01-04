import { CourseForm, ChapterForm, SubChapterForm, TextForm, MediaForm, QuizForm} from "@/components/CourseCreator/formSchema";
import { convertPictureToFile } from "@/lib/utils/conversionFunction";

interface BackendCourse {
    id: number;
    name: string;
    banner: {
        data: string;
        mimeType: string;
    };
    description: string;
    price: number;
    duration: number;
    tags: string[];
    chapters: BackendChapter[];
}

interface BackendChapter {
    id: number;
    name: string;
    order: number;
    subchapters: BackendSubchapter[];
}

interface BackendSubchapter {
    id: number;
    name: string;
    order: number;
    content: BackendContent[];
}

interface BackendContent {
    id: number;
    type: 'text' | 'image' | 'video' | 'quiz';
    order: number;
    text?: string;
    fontSize?: "small" | "medium" | "large";
    bolder?: boolean;
    italics?: boolean;
    underline?: boolean;
    textColor?: string;
    file?: {
        data: string;
        mimeType: string;
    };
    quizContent?: BackendQuizContent[];
}

interface BackendQuizContent {
    id: number;
    question: string;
    order: number;
    singleAnswer: boolean;
    answers: BackendAnswer[];
}

interface BackendAnswer {
    id: number;
    answer: string;
    order: number;
    isCorrect: boolean;
}

export const convertBackendToFormData = (backendData: BackendCourse): CourseForm => {
    return {
        id: backendData.id,
        name: backendData.name,
        banner: convertPictureToFile(backendData.banner.data, backendData.banner.mimeType),
        bannerType: backendData.banner.mimeType.startsWith('image/') ? 'image' : 'video',
        bannerMediaType: backendData.banner.mimeType as CourseForm['bannerMediaType'],
        description: backendData.description,
        price: backendData.price,
        duration: backendData.duration,
        tags: backendData.tags,
        chapters: backendData.chapters.map(convertChapter)
    };
};

const convertChapter = (chapter: BackendChapter): ChapterForm => ({
    id: chapter.id,
    name: chapter.name,
    order: chapter.order,
    subchapters: chapter.subchapters.map(convertSubchapter),
    deleted: false
});

const convertSubchapter = (subchapter: BackendSubchapter): SubChapterForm => ({
    id: subchapter.id,
    name: subchapter.name,
    order: subchapter.order,
    content: subchapter.content.map(convertContent),
    deleted: false
});

const convertContent = (content: BackendContent): TextForm | MediaForm | QuizForm => {
    switch (content.type) {
        case 'text':
            return {
                id: content.id,
                type: 'text',
                text: content.text!,
                fontSize: content.fontSize || "medium",
                bolder: content.bolder || false,
                italics: content.italics || false,
                underline: content.underline || false,
                textColor: content.textColor || '#000000',
                deleted: false
            };
        case 'image':
        case 'video':
            return {
                id: content.id,
                type: content.type,
                file: content.file ? convertPictureToFile(content.file.data, content.file.mimeType) : null,
                mediaType: content.file?.mimeType as MediaForm['mediaType'],
                deleted: false
            };
        case 'quiz':
            return {
                id: content.id,
                type: 'quiz',
                quizContent: content.quizContent!.map(quiz => ({
                    id: quiz.id,
                    question: quiz.question,
                    order: quiz.order,
                    singleAnswer: quiz.singleAnswer,
                    answers: quiz.answers.map(answer => ({
                        id: answer.id,
                        answer: answer.answer,
                        order: answer.order,
                        isCorrect: answer.isCorrect,
                        deleted: false
                    })),
                    deleted: false
                })),
                deleted: false
            };
        default:
            throw new Error(`Unknown content type: ${content.type}`);
    }
};

// Helper function to prepare data for backend
export const prepareFormDataForBackend = (formData: CourseForm) => {
    const processedData = {
        ...formData,
        chapters: formData.chapters
            .filter(chapter => !chapter.deleted)
            .map((chapter, idx) => ({
                ...chapter,
                order: idx + 1,
                subchapters: chapter.subchapters
                    .filter(subchapter => !subchapter.deleted)
                    .map((subchapter, subIdx) => ({
                        ...subchapter,
                        order: subIdx + 1,
                        content: subchapter.content
                            .filter(content => !content.deleted)
                            .map((content, contentIdx) => ({
                                ...content,
                                order: contentIdx + 1,
                                ...(content.type === 'quiz' ? {
                                    quizContent: content.quizContent
                                        .filter(quiz => !quiz.deleted)
                                        .map((quiz, quizIdx) => ({
                                            ...quiz,
                                            order: quizIdx + 1,
                                            answers: quiz.answers
                                                .filter(answer => !answer.deleted)
                                                .map((answer, answerIdx) => ({
                                                    ...answer,
                                                    order: answerIdx + 1
                                                }))
                                        }))
                                } : {})
                            }))
                    }))
            }))
    };

    return processedData;
};