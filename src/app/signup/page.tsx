import { SignupForm } from '@/components/auth/signup-form'
import { OAuthButtons } from '@/app/login/oauth-buttons'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function SignupPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Panel - Branding */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                {/* Decorative Gradient Overlay - Different text/vibe for signup? Keep consistent for now or shift hue */}
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/80 to-black opacity-80 z-10" />

                {/* Background Watermark */}
                <div className="absolute -left-20 -bottom-40 opacity-10 z-0 pointer-events-none transform -rotate-12">
                    <img src="/logo_icon.png" alt="" className="w-[600px] h-[600px] object-contain grayscale" />
                </div>

                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <Logo />
                    <span className="font-bold tracking-tight">MangaKeep</span>
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Join the community and start organizing your manga journey today.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="p-8 lg:p-8 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden justify-center mb-6 items-center gap-2">
                            <div className="scale-125">
                                <Logo />
                            </div>
                            <span className="font-bold text-xl">MangaKeep</span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>

                    <OAuthButtons />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <SignupForm />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
