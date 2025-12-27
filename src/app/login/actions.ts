'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Redirect back with error AND preserving the email
        redirect(`/login?error=Could not authenticate user&email=${encodeURIComponent(email)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    // We already validate on client, but good to have double check
    // Since we don't pass confirmPassword to Supabase, we can just check it here if needed, 
    // but typically client-side check + exact match is enough. 
    // Let's rely on basic checks or if we want to be strict:
    /*
    const confirmPassword = formData.get('confirmPassword') as string
    if (password !== confirmPassword) {
        redirect('/signup?error=Passwords do not match')
    }
    */

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                username,
            },
        },
    })

    if (error) {
        console.error(error.code + " " + error.message)
        redirect('/signup?error=Could not create user')
    }

    revalidatePath('/', 'layout')
    redirect('/signup?message=Check email to continue sign in process')
}
