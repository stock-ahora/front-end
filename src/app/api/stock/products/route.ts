import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

console.log('🟢 route.ts cargado correctamente')

function isUuid(x?: string | null) {
    return !!x && /^[0-9a-fA-F-]{36}$/.test(x)
}

export async function GET(req: Request) {
    try {
        console.log('ENV TEST:', process.env.AWS_API_BASE, process.env.CLIENT_ACCOUNT_ID)

        const base = process.env.AWS_API_BASE // ej: http://...elb...:8082/api/v1/stock
        const envClient = process.env.CLIENT_ACCOUNT_ID
        const apiKey = process.env.AWS_API_KEY

        if (!base) {
            return NextResponse.json({ ok: false, where: 'proxy', error: 'Missing AWS_API_BASE' }, { status: 500 })
        }

        const { searchParams } = new URL(req.url)
        const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
        const size = Math.max(1, Number(searchParams.get('size') ?? '10') || 10)

        const clientHeader =
            req.headers.get('x-client-account-id') || req.headers.get('X-Client-Account-Id')
        const client = clientHeader || envClient
        if (!client) {
            return NextResponse.json(
                { ok: false, where: 'proxy', error: 'Missing X-Client-Account-Id (header) or CLIENT_ACCOUNT_ID (env)' },
                { status: 400 }
            )
        }
        if (!isUuid(client)) {
            return NextResponse.json({ ok: false, where: 'proxy', error: `Invalid UUID: ${client}` }, { status: 400 })
        }

        const url = `${base}?page=${encodeURIComponent(String(page))}&size=${encodeURIComponent(String(size))}`
        const headers: Record<string, string> = {
            'X-Client-Account-Id': client,
            'Content-Type': 'application/json',
        }
        if (apiKey && apiKey.trim()) headers['x-api-key'] = apiKey

        const upstream = await fetch(url, { method: 'GET', headers, cache: 'no-store' })
        const raw = await upstream.text()

        let parsed: any = null
        try { parsed = JSON.parse(raw) } catch {}

        if (!upstream.ok) {
            console.error('[INV PROXY] Upstream error:', upstream.status, raw)
            return NextResponse.json(
                { ok: false, where: 'upstream', status: upstream.status, error: parsed || raw || 'Upstream error' },
                { status: upstream.status }
            )
        }

        if (
            parsed &&
            Array.isArray(parsed.data) &&
            typeof parsed.total === 'number' &&
            typeof parsed.page === 'number' &&
            typeof parsed.size === 'number'
        ) {
            return NextResponse.json({ ok: true, ...parsed })
        }

        const data: any[] = Array.isArray(parsed?.data) ? parsed.data : []
        const total = typeof parsed?.total === 'number' ? parsed.total : data.length
        const start = (page - 1) * size
        const slice = data.length ? data.slice(start, start + size) : data

        return NextResponse.json({
            ok: true,
            data: slice,
            total,
            page,
            size,
            total_pages: Math.max(0, Math.ceil(total / size)),
        })
    } catch (err: any) {
        console.error('[INV PROXY] CATCH ERROR FULL:', err)
        return NextResponse.json(
            { ok: false, where: 'proxy-catch', error: err?.message || String(err), stack: err?.stack || null },
            { status: 500 }
        )
    }
}
