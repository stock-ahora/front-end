import { NextResponse } from 'next/server'

function isUuid(x?: string | null) {
    return !!x && /^[0-9a-fA-F-]{36}$/.test(x)
}

export async function GET(req: Request) {
    const base = process.env.AWS_API_BASE as string
    // const apiKey = process.env.AWS_API_KEY
    const envClient = process.env.CLIENT_ACCOUNT_ID

    if (!base) return NextResponse.json({ ok:false, error:'Missing AWS_API_BASE' }, { status:500 })

    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') ?? '1'
    const size = searchParams.get('size') ?? '20'
    const client = searchParams.get('client_account_id') || envClient

    if (!client) return NextResponse.json({ ok:false, error:'Missing client_account_id (env or query)' }, { status:400 })
    if (!isUuid(client)) return NextResponse.json({ ok:false, error:`Invalid UUID: ${client}` }, { status:400 })

    const url = `${base}/api/v1/stock/product?client_account_id=${encodeURIComponent(client)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`
    const headers: Record<string,string> = {}
    if (apiKey && apiKey.trim()) headers['x-api-key'] = apiKey

    const upstream = await fetch(url, { headers, cache:'no-store' })
    const raw = await upstream.text()
    let parsed: any = null
    try { parsed = JSON.parse(raw) } catch {}
    if (!upstream.ok) {
        console.error('[API-GW ERROR]', upstream.status, raw)
        return NextResponse.json({ ok:false, status:upstream.status, error: parsed || raw || 'Upstream error' }, { status: upstream.status })
    }
    return NextResponse.json({ ok:true, ...(parsed ?? { data: [] , total:0, page:Number(page), size:Number(size), total_pages:0 }) })
}
