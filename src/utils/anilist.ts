export interface AniListResult {
    id: number;
    title: string;
    coverImage: {
        large: string;
        extraLarge: string;
    };
    description: string;
    siteUrl: string;
}

const query = `
query ($search: String) {
  Media (search: $search, type: MANGA) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      extraLarge
    }
    description
    siteUrl
  }
}
`;

export async function searchMangaOnAniList(title: string): Promise<AniListResult | null> {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { search: title }
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.warn('AniList Errors:', result.errors);
            return null;
        }

        return result.data?.Media || null;
    } catch (error) {
        console.error('AniList Lookup Error:', error);
        return null;
    }
}
