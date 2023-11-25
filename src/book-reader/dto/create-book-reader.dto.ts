export class CreateBookReaderDto {
    id: number;
    name: string;
    videoUrl: string;
    bookmarker: number;
    isVideo: boolean;
    langOriginal: string;
    langTranslation: string;
    isRead: boolean;
}
