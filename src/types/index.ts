export type EditionType = 'Standard' | 'Omnibus' | 'Deluxe' | 'Digital';
export type ReadingStatus = 'unread' | 'reading' | 'completed' | 'collected';

export interface MangaSeries {
    id: string;
    title: string;
    author: string | null;
    description: string | null;
    cover_url: string | null;
    anilist_id: number | null;
    created_at: string;
}

export interface UserVolume {
    id: string;
    user_id: string;
    series_id: string;
    volume_number: string;
    isbn: string | null;
    language: string;
    edition_type: EditionType;
    status: ReadingStatus;
    tags: string[] | null;
    created_at: string;
    manga_series?: MangaSeries; // Joined data
    collection_id?: string | null;
}

export interface Collection {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    volume_count?: number; // Computed
    cover_url?: string | null; // Computed from first volume
}
