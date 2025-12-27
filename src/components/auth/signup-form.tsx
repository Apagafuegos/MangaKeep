'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signup } from '@/app/login/actions'
import { useSearchParams } from 'next/navigation'

export function SignupForm() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const error = searchParams.get('error')

    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setPasswordError('')

        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            setIsPending(false)
            return
        }

        try {
            await signup(formData)
        } catch (e) {
            // In case the action throws, though normally it redirects
            console.error(e)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Username</span>
                <input
                    type="text"
                    name="username"
                    required
                    placeholder="OtakuKing99"
                    className="border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                    type="email"
                    name="email"
                    required
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

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Confirm Password</span>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        className="w-full border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="sr-only">
                            {showConfirmPassword ? "Hide password" : "Show password"}
                        </span>
                    </button>
                </div>
            </label>

            {passwordError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm text-center">
                    {passwordError}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Sign Up
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
