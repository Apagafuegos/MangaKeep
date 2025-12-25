'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function importVolumes(volumes: any[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Process in batches or parallel
    // For MVP, we'll loop. A more robust solution would be a stored procedure or careful batching.
    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const vol of volumes) {
        try {
            const title = vol.Title || vol.title
            const volume_number = vol.Volume || vol.volume_number || vol.volume
            const author = vol.Author || vol.author
            const isbn = vol.ISBN || vol.isbn
            const language = vol.Language || vol.language || 'en'
            const edition_type = vol.Edition || vol.edition_type || 'Standard'

            if (!title || !volume_number) {
                results.failed++
                results.errors.push(`Missing title or volume for row: ${JSON.stringify(vol)}`)
                continue
            }

            // 1. Check or Create Series
            let seriesId: string | null = null

            const { data: existingSeries } = await supabase
                .from('manga_series')
                .select('id')
                .ilike('title', title)
                .single()

            if (existingSeries) {
                seriesId = existingSeries.id
            } else {
                // Try to enrich if possible, or just insert
                const { data: newSeries, error: seriesError } = await supabase
                    .from('manga_series')
                    .insert({
                        title,
                        author: author || null,
                    })
                    .select('id')
                    .single()

                if (seriesError || !newSeries) {
                    throw new Error('Failed to create series')
                }
                seriesId = newSeries.id
            }

            // 2. Insert Volume
            const { error: insertError } = await supabase
                .from('user_volumes')
                .insert({
                    user_id: user.id,
                    series_id: seriesId,
                    volume_number: volume_number.toString(),
                    edition_type,
                    language,
                    isbn,
                    is_read: false
                })

            if (insertError) throw insertError
            results.success++

        } catch (e: any) {
            results.failed++
            results.errors.push(`Error importing ${vol.Title}: ${e.message}`)
        }
    }

    revalidatePath('/')
    return results
}
