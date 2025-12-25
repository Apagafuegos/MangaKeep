'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getLibrary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data, error } = await supabase
        .from('user_volumes')
        .select(`
      *,
      manga_series (*)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching library:', error)
        return []
    }

    return data
}

export async function addVolume(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const volume_number = formData.get('volume_number') as string
    const edition_type = formData.get('edition_type') as string
    const language = formData.get('language') as string || 'en'
    const isbn = formData.get('isbn') as string || null

    // Collection logic
    const collectionIdInput = formData.get('collection_id') as string | null
    const newCollectionName = formData.get('new_collection_name') as string | null

    if (!title || !volume_number) {
        throw new Error('Title and Volume Number are required')
    }

    // 1. Check or Create Series
    // Simple normalization to avoid duplicates: exact match for now
    let seriesId: string | null = null

    const { data: existingSeries } = await supabase
        .from('manga_series')
        .select('id')
        .ilike('title', title)
        .single()

    if (existingSeries) {
        seriesId = existingSeries.id
    } else {
        // Create new series with AniList enrichment
        const { searchMangaOnAniList } = await import('@/utils/anilist')
        const metadata = await searchMangaOnAniList(title)

        const { data: newSeries, error: seriesError } = await supabase
            .from('manga_series')
            .insert({
                title,
                author: author || null,
                description: metadata?.description || null,
                cover_url: metadata?.coverImage?.extraLarge || null,
                anilist_id: metadata?.id || null,
            })
            .select('id')
            .single()

        if (seriesError || !newSeries) {
            console.error('Error creating series:', seriesError)
            throw new Error('Failed to create series')
        }
        seriesId = newSeries.id
    }

    // 2. Handle Collection (Create if needed)
    let finalCollectionId = collectionIdInput
    if (newCollectionName && !finalCollectionId) {
        const { data: newCollection, error: collectionError } = await supabase
            .from('collections')
            .insert({ name: newCollectionName, user_id: user.id })
            .select('id')
            .single()

        if (!collectionError && newCollection) {
            finalCollectionId = newCollection.id
        }
    }

    // 2. Add Volume
    const { data: newVolume, error: volumeError } = await supabase
        .from('user_volumes')
        .insert({
            user_id: user.id,
            series_id: seriesId,
            volume_number,
            edition_type,
            language,
            status: 'unread',
            isbn: isbn,
        })
        .select('id')
        .single()

    if (volumeError || !newVolume) {
        console.error('Error adding volume:', volumeError)
        throw new Error('Failed to add volume')
    }

    // 3. Assign to Collection (M:N)
    // Deprecated: user_volumes.collection_id. Use collection_volumes
    if (finalCollectionId) {
        const { error: linkError } = await supabase
            .from('collection_volumes')
            .insert({
                collection_id: finalCollectionId,
                user_volume_id: newVolume.id
            })

        if (linkError) {
            console.error('Failed to link volume to collection', linkError)
            // Proceed anyway
        }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteVolume(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_volumes')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete volume')
    }

    revalidatePath('/')
}

export async function updateStatus(id: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_volumes')
        .update({ status: status })
        .eq('id', id)

    if (error) {
        throw new Error('Failed to update status')
    }

    revalidatePath('/')
}

export async function bulkDeleteVolumes(ids: string[]) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_volumes')
        .delete()
        .in('id', ids)

    if (error) {
        throw new Error('Failed to delete volumes')
    }

    revalidatePath('/')
}

export async function bulkUpdateStatus(ids: string[], status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_volumes')
        .update({ status: status })
        .in('id', ids)

    if (error) {
        throw new Error('Failed to update volumes')
    }

    revalidatePath('/')
}

export async function getCollections() {
    const supabase = await createClient()

    // Fetch collections and count volumes via junction
    // Using simple count(collection_volumes)
    const { data, error } = await supabase
        .from('collections')
        .select(`
            *,
            volume_count:collection_volumes(count)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching collections:', error)
        return []
    }

    // Normalize count structure if necessary or use as is in UI
    // Supabase returns { volume_count: [{ count: 5 }] } usually if select(count)
    return data
}

export async function createCollection(name: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('collections')
        .insert({ name, user_id: user.id })

    if (error) throw new Error('Failed to create collection')

    revalidatePath('/collections')
}

export async function getCollectionDetails(id: string) {
    const supabase = await createClient()

    const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single()

    if (collectionError) return null

    // Fetch volumes via Junction Table
    // collection_volumes -> user_volume_id -> user_volumes -> manga_series
    const { data, error } = await supabase
        .from('collection_volumes')
        .select(`
            user_volume:user_volumes (
                *,
                manga_series (*)
            )
        `)
        .eq('collection_id', id)
        // Ordering by added_at in junction table would be nice, assuming it has created_at
        .order('created_at', { ascending: true })

    if (error) return null

    // Flatten structure
    const volumes = data.map((item: any) => item.user_volume).filter(Boolean)

    return { collection, volumes }
}

export async function getAllVolumesWithCollectionStatus() {
    const supabase = await createClient()

    // Fetch all volumes and check if they belong to ANY collection
    const { data, error } = await supabase
        .from('user_volumes')
        .select(`
            *,
            manga_series (*),
            collection_volumes (collection_id)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return []
    }

    // Transform: Add 'isInCollection' flag
    return data.map((vol: any) => ({
        ...vol,
        isInCollection: vol.collection_volumes && vol.collection_volumes.length > 0
    }))
}

export async function createCollectionWithVolumes(name: string, volumeIds: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // 1. Create Collection
    const { data: collection, error: createError } = await supabase
        .from('collections')
        .insert({ name, user_id: user.id })
        .select()
        .single()

    if (createError) throw new Error('Failed to create collection')

    // 2. Assign Volumes (M:N)
    if (volumeIds.length > 0) {
        const pivotRows = volumeIds.map(vid => ({
            collection_id: collection.id,
            user_volume_id: vid
        }))

        const { error: updateError } = await supabase
            .from('collection_volumes')
            .insert(pivotRows)

        if (updateError) throw new Error('Failed to assign volumes')
    }

    revalidatePath('/collections')
}
