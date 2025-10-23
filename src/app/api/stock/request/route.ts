import { NextResponse } from 'next/server'

function isUuid(x?: string | null) {
    return !!x && /^[0-9a-fA-F-]{36}$/.test(x)
}

export const dynamic = 'force-dynamic' // evita caché en dev

export async function POST(req: Request) {
    try {
        const base = process.env.AWS_API_BASE
        const apiKey = process.env.AWS_API_KEY
        const envClient = process.env.CLIENT_ACCOUNT_ID

        if (!base) {
            return NextResponse.json({ ok: false, where: 'proxy', error: 'Missing AWS_API_BASE' }, { status: 500 })
        }

        // ✅ Permite enviar el Client-Account por header desde el front,
        //    o tomarlo del .env.local como fallback
        const clientHeader =
            req.headers.get('x-client-account-id') ||
            req.headers.get('X-Client-Account-Id') // (normalmente ya llega en minúsculas)
        const client = clientHeader || envClient
        if (!client) {
            return NextResponse.json({ ok: false, where: 'proxy', error: 'Missing X-Client-Account-Id (header) or CLIENT_ACCOUNT_ID (env)' }, { status: 400 })
        }
        if (!isUuid(client)) {
            return NextResponse.json({ ok: false, where: 'proxy', error: `Invalid UUID: ${client}` }, { status: 400 })
        }

        // ⤵️ Leemos el form-data entrante
        const formIn = await req.formData()
        const file = formIn.get('file')
        const type = (formIn.get('type') || 'in').toString() // "in" | "out"

        if (!(file instanceof Blob)) {
            return NextResponse.json({ ok: false, where: 'proxy', error: 'Missing file in multipart form-data (field "file")' }, { status: 400 })
        }

        // Re-armamos el FormData para reenviar al API Gateway
        const form = new FormData()
        // conserva nombre/mime si vienen
        const filename = (file as any)?.name || 'upload'
        const mime = (file as any)?.type || 'application/octet-stream'
        form.append('file', file, filename)
        form.append('type', type)

        const url = `${base}/api/stock/request` // ← ojo: esta ruta es la que pusiste en tu curl
        const headers: Record<string, string> = {
            'X-Client-Account-Id': client,
            // ¡NO pongas content-type aquí! fetch lo genera con boundary automáticamente
        }
        if (apiKey && apiKey.trim()) headers['x-api-key'] = apiKey

        const upstream = await fetch(url, {
            method: 'POST',
            headers,
            body: form,
            cache: 'no-store',
        })

        const raw = await upstream.text()
        let parsed: any = null
        try { parsed = JSON.parse(raw) } catch {}

        if (!upstream.ok) {
            console.error('[API-GW ERROR][REQUEST]', upstream.status, raw)
            return NextResponse.json(
                { ok: false, where: 'upstream', status: upstream.status, error: parsed || raw || 'Upstream error' },
                { status: upstream.status }
            )
        }

        return NextResponse.json({ ok: true, data: parsed ?? raw })
    } catch (e: any) {
        return NextResponse.json({ ok: false, where: 'proxy-catch', error: e?.message || String(e) }, { status: 500 })
    }
}
