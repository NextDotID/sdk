export function buildHeaders(headers: HeadersInit | undefined) {
  headers = new Headers(headers ?? {})
  headers.set('accept-type', 'application/json')
  headers.set('content-type', 'application/json')
  return headers
}

export function buildURL(pathname: string, baseURL: URL, params?: Record<string, string | undefined>) {
  const url = new URL(pathname, baseURL)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue
    url.searchParams.set(key, value)
  }
  return url.toString()
}
