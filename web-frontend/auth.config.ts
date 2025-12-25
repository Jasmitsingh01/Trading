import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Check if Google OAuth is configured
const isGoogleConfigured =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID !== 'placeholder-google-client-id' &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_SECRET !== 'placeholder-google-client-secret'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: isGoogleConfigured ? [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ] : [],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // Temporarily disable auth protection for admin pages
            // const isLoggedIn = !!auth?.user
            // const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            // const isOnAuth = nextUrl.pathname.startsWith('/auth')

            // if (isOnAdmin) {
            //     if (isLoggedIn) return true
            //     return false // Redirect to login
            // } else if (isOnAuth) {
            //     if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl))
            //     return true
            // }

            // Allow all access for now
            return true
        },
    },
    // Provide a default secret if not set (for development only)
    secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
})

