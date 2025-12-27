'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { login } from '@/app/login/actions'
import { useSearchParams } from 'next/navigation'

export function LoginForm() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const error = searchParams.get('error')
    const emailParam = searchParams.get('email') // Get preserved email

    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            await login(formData)
        } catch (e) {
            console.error(e)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                    type="email"
                    name="email"
                    required
                    defaultValue={emailParam || ''}
                    placeholder="you@example.com"
                    className="border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Password</span>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="••••••••"
                        className="w-full border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </button>
                </div>
            </label>

            <button
                type="submit"
                disabled={isPending}
                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Log in
            </button>

            {message && (
                <div className="mt-4 p-3 bg-muted rounded text-sm text-center">
                    {message}
                </div>
            )}
            {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm text-center">
                    {error}
                </div>
            )}
        </form>
    )
}
