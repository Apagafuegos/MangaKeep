'use server'

import { searchByISBN } from '@/utils/google-books'

export async function lookupISBN(isbn: string) {
    return await searchByISBN(isbn)
}
