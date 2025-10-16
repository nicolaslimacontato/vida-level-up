import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // O trigger automático já cria o profile quando o usuário é inserido em auth.users
            // Não precisamos criar manualmente aqui
            console.log('Usuário autenticado com sucesso via OAuth')
        }
    }

    // Redirecionar para dashboard
    return NextResponse.redirect(`${origin}/dashboard`)
}
