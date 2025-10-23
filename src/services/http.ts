// src/services/http.ts
export type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    headers?: Record<string, string>
    body?: any
    cache?: RequestCache
    next?: { revalidate?: number }
    query?: Record<string, string | number | boolean | undefined>
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

function makeUrl(path: string, query?: FetchOptions['query']) {
    const url = new URL(`${BASE}${path}`)
    if (query) {
        Object.entries(query).forEach(([k, v]) => {
            if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
        })
    }
    return url.toString()
}

export async function api<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
        ...opts.headers,
    }

    const res = await fetch(makeUrl(path, opts.query), {
        method: opts.method ?? 'GET',
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        cache: opts.cache ?? 'no-store',
        next: opts.next,
    })

    if (!res.ok) {
        let detail: unknown
        try {
            detail = await res.json()
        } catch {}
        throw new Error(`API ${res.status} ${res.statusText} – ${JSON.stringify(detail ?? {})}`)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
}
