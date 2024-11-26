

export interface fetchedContentModel {
    id: number,
    type: 'text' | 'video' | 'image' | 'quiz',
    order: number,
    file:  {
        data: string;
        mimeType: string;
    },
}