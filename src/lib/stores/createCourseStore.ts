import {create} from 'zustand';
import {
    Answer,
    ChapterData,
    cImage,
    CourseData,
    cQuiz,
    cText,
    cVideo,
    QuizForm,
    SubChapterData
} from '@/models/CourseData';
import {formSchema} from "@/components/CourseCreator/formSchema";

interface CreateCourseStore {
    course: CourseData;
    validation: {
        errors: Record<string, string>;
        isValid: boolean;
    };
    setCourseName: (name: string) => void;
    setCourseBanner: (file: File) => void;
    setCourseDescription: (description: string) => void;
    addChapter: () => void;
    removeChapter: (chapterId: number) => void;
    updateChapterName: (chapterId: number, name: string) => void;
    addSubChapter: (chapterId: number) => void;
    removeSubChapter: (chapterId: number, subChapterId: number) => void;
    updateSubChapterName: (chapterId: number, subChapterId: number, name: string) => void;
    addContentToSubChapter: (chapterId: number, subChapterId: number, contentType: 'text' | 'video' | 'image' | 'quiz') => void;
    removeContentFromSubChapter: (chapterId: number, subChapterId: number, contentId: number) => void;
    updateTextContent: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        text: string,
        fontSize?: "small" | "medium" | "large",
        fontWeight?: "normal" | "bold" | "bolder",
        italics?: boolean,
        emphasis?: boolean
    ) => void;
    updateVideoContent: (chapterId: number, subChapterId: number, contentId: number, file: File) => void;
    updateImageContent: (chapterId: number, subChapterId: number, contentId: number, file: File) => void;
    addQuizQuestion: (chapterId: number, subChapterId: number, contentId: number) => void;
    removeQuizQuestion: (chapterId: number, subChapterId: number, contentId: number, questionId: number) => void;
    updateQuizQuestion: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number,
        question: string
    ) => void;
    addQuizAnswer: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number
    ) => void;
    removeQuizAnswer: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number,
        answerId: number
    ) => void;
    updateQuizAnswer: (
        chapterId: number,
        subChapterId: number,
        contentId: number,
        questionId: number,
        answerId: number,
        answer: string,
        isCorrect: boolean
    ) => void;
}

const initialCourse: CourseData = {
    id: 1,
    name: '',
    banner: null,
    review: 0,
    userProfileID: 1,
    description: '',
    chapters: [{
        id: 1,
        order: 1,
        name: 'Chapter 1',
        review: 0,
        subchapters: [{
            id: 1,
            order: 1,
            name: 'Subchapter 1',
            completed: false,
            content: []
        }]
    }]
};
const getChapterCount = (chapters: ChapterData[]) => {
    return chapters.length;
}
const getSubChapterCount = (chapters: ChapterData[], chapterId: number) => {
    const chapter = chapters.find(chapter => chapter.id === chapterId);
    return chapter ? chapter.subchapters.length : 0;
}
// const getContentCount = (chapters: ChapterData[], chapterId: number, subChapterId: number) => {
//     const chapter = chapters.find(chapter => chapter.id === chapterId);
//     if (!chapter) return 0;
//     const subchapter = chapter.subchapters.find(subchapter => subchapter.id === subChapterId);
//     return subchapter ? subchapter.content.length : 0;
// };

const getQuizQuestionCount = (chapters: ChapterData[], chapterId: number, subChapterId: number, contentId: number) => {
    const chapter = chapters.find(chapter => chapter.id === chapterId);
    if (!chapter) return 0;
    const subChapter = chapter.subchapters.find(subChapter => subChapter.id === subChapterId);
    if (!subChapter) return 0;
    const content = subChapter.content.find(content => content.id === contentId && content.type === 'quiz');
    if (!content) return 0;
    const quiz = content as cQuiz;
    return quiz.quizContent.length;
};
const getQuizAnswerCount = (chapters: ChapterData[], chapterId: number, subChapterId: number, contentId: number, questionId: number) => {
    const chapter = chapters.find(chapter => chapter.id === chapterId);
    if (!chapter) return 0;

    const subChapter = chapter.subchapters.find(subChapter => subChapter.id === subChapterId);
    if (!subChapter) return 0;

    const content = subChapter.content.find(content => content.id === contentId && content.type === 'quiz');
    if (!content) return 0;

    const quiz = content as cQuiz;
    const question = quiz.quizContent.find(q => q.id === questionId);
    return question ? question.answers.length : 0;
};

const updateChapter = (chapters: ChapterData[], chapterId: number, updater: (chapter: ChapterData) => ChapterData): ChapterData[] => {
    return chapters.map(chapter => chapter.id === chapterId ? updater(chapter) : chapter);
};

const updateSubChapter = (subchapters: SubChapterData[], subChapterId: number, updater: (subchapter: SubChapterData) => SubChapterData): SubChapterData[] => {
    return subchapters.map(subchapter => subchapter.id === subChapterId ? updater(subchapter) : subchapter);
};

const updateContent = (content: (cText | cVideo | cImage | cQuiz)[], contentId: number, updater: (item: (cText | cVideo | cImage | cQuiz)) => (cText | cVideo | cImage | cQuiz)): (cText | cVideo | cImage | cQuiz)[] => {
    return content.map(item => item.id === contentId ? updater(item) : item);
};

const validateCourse = (courseData: CourseData) => {
    try {
        formSchema.parse(courseData);
        return {isValid: true, errors: {}};
    } catch (error: any) {
        const errors: Record<string, string> = {};
        if (error.errors) {
            error.errors.forEach((err: any) => {
                errors[err.path.join('.')] = err.message;
            });
        }
        return {isValid: false, errors};
    }
};

let chapterId = 1;
const chapterIdGenerator = () => chapterId = chapterId + 1;

let subChapterId = 1;
const subChapterIdGenerator = () => subChapterId = subChapterId + 1 ;

let contentId = 0
const contentIdGenerator = () => contentId = contentId + 1;

let questionId = 0;
const questionIdGenerator = () => questionId = questionId + 1;

let answerId = 0;
const answerIdGenerator = () =>answerId = answerId + 1;

export const useCreateCourseStore = create<CreateCourseStore>((set) => ({
    course: initialCourse,
    validation: {isValid: false, errors: {}},

    setCourseName: (name) => set((state) => {
        const newState = {
            ...state,
            course: {...state.course, name}
        };
        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    setCourseBanner: (banner) => set((state) => {
        const newState = {
            ...state,
            course: {...state.course, banner}
        };
        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    setCourseDescription: (description) => set((state) => {
        const newState = {
            ...state,
            course: {...state.course, description}
        };
        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    addChapter: () => set((state) => {
        chapterId = chapterIdGenerator()
        const newChapter: ChapterData = {
            id: chapterId,
            order: chapterId,
            name: `Chapter ${chapterId}`,
            review: 0,
            subchapters: [{
                id: 1,
                order: 1,
                name: `SubChapter 1`,
                completed: false,
                content: []
            }]
        };

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: [...state.course.chapters, newChapter]
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    removeChapter: (chapterId: number) => set((state) => {
        if (getChapterCount(state.course.chapters) <= 1) {
            return state;
        }

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: state.course.chapters
                    .filter(chapter => chapter.id !== chapterId)
                    .map((chapter, index) => ({
                        ...chapter,
                        order: index
                    }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    updateChapterName: (chapterId, name) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: state.course.chapters.map(chapter =>
                    chapter.id === chapterId ? {...chapter, name} : chapter
                )
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    addSubChapter: (chapterId: number) => set((state) => {
        const subChapterId = subChapterIdGenerator()
        const newSubChapter: SubChapterData = {
            id: subChapterId,
            order: subChapterId,
            name: `SubChapter ${subChapterId}`,
            completed: false,
            content: []
        };

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, chapter => ({
                    ...chapter,
                    subchapters: [...chapter.subchapters, newSubChapter]
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    removeSubChapter: (chapterId: number, subChapterId: number) => set((state) => {
        if (getSubChapterCount(state.course.chapters, chapterId) <= 1) {
            return state;
        }

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, chapter => ({
                    ...chapter,
                    subchapters: chapter.subchapters
                        .filter(subChapter => subChapter.id !== subChapterId)
                        .map((subChapter, index) => ({...subChapter, order: index}))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    updateSubChapterName: (chapterId: number, subChapterId: number, name: string) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, chapter => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, subChapter => ({
                        ...subChapter,
                        name
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),

    addContentToSubChapter: (chapterId: number, subChapterId: number, contentType: string) => set((state) => {

        const contentId = contentIdGenerator()



        const createInitialContent = (): (cText | cVideo | cImage | cQuiz) => {
            switch (contentType) {
                case 'text':
                    return {
                        id: contentId,
                        order: contentId,
                        type: 'text',
                        text: 'Add text here',
                        fontSize: "medium",
                        fontWeight: "normal",
                        italics: false,
                        emphasis: false
                    } as cText;
                case 'video':
                    return {
                        id: contentId,
                        order: contentId,
                        type: 'video',
                        video: null
                    } as cVideo;
                case 'image':
                    return {
                        id: contentId,
                        order: contentId,
                        type: 'image',
                        image: null
                    } as cImage;
                case 'quiz':
                    const questionId = questionIdGenerator()
                    const answerId = answerIdGenerator()
                    const answrId2 = answerIdGenerator()
                    return {
                        id: contentId,
                        type: 'quiz',
                        quizContent: [{
                            id: questionId,
                            question: `Question ${questionId}`,
                            order: questionId,
                            answers: [
                                {
                                    id: answerId,
                                    order: answerId,
                                    answer: `Answer ${answerId}`,
                                    isCorrect: false
                                },
                                {
                                    id: answrId2,
                                    order: answrId2,
                                    answer: `Answer ${answrId2}`,
                                    isCorrect: false
                                }
                            ],
                            singleAnswer: true
                        }]
                    } as cQuiz;
                default:
                    return {
                        id: contentId,
                        order: contentId,
                        type: 'text',
                        text: 'Add text here',
                        fontSize: "medium",
                        fontWeight: "normal",
                        italics: false,
                        emphasis: false
                    } as cText;
            }
        };

        const newContent = createInitialContent();
        if (!newContent) return state;

        const newState = updateChapter(state.course.chapters, chapterId, (chapter) => ({
            ...chapter,
            subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                ...subChapter,
                content: [
                    ...subChapter.content,
                    {...newContent, order: subChapter.content.length}
                ]
            }))
        }));

        return {
            ...state,
            course: {...state.course, chapters: newState},
            validation: validateCourse({...state.course, chapters: newState})
        };
    }),


    removeContentFromSubChapter: (chapterId, subChapterId, contentId) => set((state) => {
        const newState = updateChapter(state.course.chapters, chapterId, (chapter) => ({
            ...chapter,
            subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                ...subChapter,
                content: subChapter.content
                    .filter(content => content.id !== contentId)
                    .map((content, index) => ({
                        ...content,
                        order: index
                    }))
            }))
        }));

        return {
            ...state,
            course: {...state.course, chapters: newState},
            validation: validateCourse({...state.course, chapters: newState})
        };
    }),

    updateTextContent: (chapterId, subChapterId, contentId, text, fontSize = "medium", fontWeight = "normal", italics = false, emphasis = false) => set((state) => {
        const newState = updateChapter(state.course.chapters, chapterId, (chapter) => ({
            ...chapter,
            subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                ...subChapter,
                content: updateContent(subChapter.content, contentId, (item) => {
                    if (item.type === 'text') {
                        return {
                            ...item,
                            text,
                            fontSize,
                            fontWeight,
                            italics,
                            emphasis
                        };
                    }
                    return item;
                })
            }))
        }));

        return {
            ...state,
            course: {...state.course, chapters: newState},
            validation: validateCourse({...state.course, chapters: newState})
        };
    }),

    updateVideoContent: (chapterId: number, subChapterId: number, contentId: number, video: File) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'video' ? {...item, video} : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    updateImageContent: (chapterId: number, subChapterId: number, contentId: number, image: File) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'image' ? {...item, image} : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    addQuizQuestion: (chapterId: number, subChapterId: number, contentId: number) => set((state) => {
        const questionId = questionIdGenerator()
        const answerId = answerIdGenerator()
        const answerId2 = answerIdGenerator()
        const newQuestion: QuizForm = {
            id: questionId,
            question: `Question ${questionId}`,
            order: questionId,
            answers: [
                {id: answerId, order: answerId, answer: `Answer ${answerId}`, isCorrect: false},
                {id: answerId2 + 1, order: answerId2 + 1, answer: `Answer ${answerId2 + 1}`, isCorrect: false}
            ],
            singleAnswer: true
        };

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: [...item.quizContent, newQuestion]
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    removeQuizQuestion: (chapterId: number, subChapterId: number, contentId: number, questionId: number) => set((state) => {
        if (getQuizQuestionCount(state.course.chapters, chapterId, subChapterId, contentId) <= 1) {
            return state;
        }

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: item.quizContent.filter(question => question.id !== questionId)
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    updateQuizQuestion: (chapterId, subChapterId, contentId, questionId, question) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: item.quizContent.map(q =>
                                    q.id === questionId ? {...q, question} : q
                                )
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    addQuizAnswer: (chapterId, subChapterId, contentId, questionId) => set((state) => {

        const answerId = answerIdGenerator()
        const newAnswer: Answer = {
            id: answerId,
            order: answerId,
            answer: `Answer ${answerId}`,
            isCorrect: false
        };

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: item.quizContent.map(q =>
                                    q.id === questionId ? {...q, answers: [...q.answers, newAnswer]} : q
                                )
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    removeQuizAnswer: (chapterId, subChapterId, contentId, questionId, answerId) => set((state) => {
        if (getQuizAnswerCount(state.course.chapters, chapterId, subChapterId, contentId, questionId) <= 2) {
            return state;
        }

        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: item.quizContent.map(q =>
                                    q.id === questionId ? {
                                        ...q,
                                        answers: q.answers.filter(a => a.id !== answerId)
                                    } : q
                                )
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),


    updateQuizAnswer: (chapterId, subChapterId, contentId, questionId, answerId, answer, isCorrect) => set((state) => {
        const newState = {
            ...state,
            course: {
                ...state.course,
                chapters: updateChapter(state.course.chapters, chapterId, (chapter) => ({
                    ...chapter,
                    subchapters: updateSubChapter(chapter.subchapters, subChapterId, (subChapter) => ({
                        ...subChapter,
                        content: updateContent(subChapter.content, contentId, (item) =>
                            item.type === 'quiz' ? {
                                ...item,
                                quizContent: item.quizContent.map(q =>
                                    q.id === questionId ? {
                                        ...q,
                                        answers: q.answers.map(a =>
                                            a.id === answerId ? {...a, answer, isCorrect} : a
                                        )
                                    } : q
                                )
                            } : item
                        )
                    }))
                }))
            }
        };

        return {
            ...newState,
            validation: validateCourse(newState.course)
        };
    }),
}));
