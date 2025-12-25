import { login, signup } from './actions'
import { OAuthButtons } from './oauth-buttons'

export default async function LoginPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const message = searchParams.message as string | undefined
    const error = searchParams.error as string | undefined

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
            <div className="w-full max-w-sm bg-card rounded-lg shadow-lg border p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">MangaKeep</h1>

                <OAuthButtons />

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                    </div>
                </div>

                <form className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Email</span>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className="border rounded px-3 py-2 bg-background"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Password</span>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="border rounded px-3 py-2 bg-background"
                        />
                    </label>

                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            formAction={login}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            formAction={signup}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded font-medium transition-colors"
                        >
                            Sign up
                        </button>
                    </div>

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
            </div>
        </div>
    )
}
