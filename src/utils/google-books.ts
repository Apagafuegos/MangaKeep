export interface GoogleBookResult {
    title: string;
    author: string;
    description: string;
    thumbnail: string | null;
}

export async function searchByISBN(isbn: string): Promise<GoogleBookResult | null> {
    try {
        const cleanIsbn = isbn.replace(/[^0-9X]/g, '');
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);

        if (!res.ok) return null;

        const data = await res.json();
        if (!data.items || data.items.length === 0) return null;

        const info = data.items[0].volumeInfo;

        return {
            title: info.title || '',
            author: info.authors ? info.authors[0] : '',
            description: info.description || '',
            thumbnail: info.imageLinks ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail) : null
        };
    } catch (error) {
        console.error('Google Books Lookup Error:', error);
        return null;
    }
}
