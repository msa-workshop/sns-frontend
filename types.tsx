// types.ts
export interface Feed {
    feedId: number;
    imageId: string | null;
    uploaderName: string;
    uploaderId: number;
    uploadDatetime: string;
    contents: string;
    likes: number;
}
