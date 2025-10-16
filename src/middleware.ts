import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    // Skip middleware for static files and _not-found page
    if (req.nextUrl.pathname.startsWith('/_not-found') || 
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next()
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Missing Supabase environment variables in middleware');
        return NextResponse.next()
    }

    let response = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // Rotas protegidas - redirecionar para login se não autenticado
    const protectedRoutes = ['/dashboard', '/quests', '/missoes-principais', '/shop', '/inventory', '/recompensas', '/estatisticas', '/settings']
    if (!session && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Já logado, redirecionar de login/signup para dashboard
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|_not-found).*)',
    ]
}
