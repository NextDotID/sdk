export function buildHeaders(headers: HeadersInit | undefined) {
  if (!headers) return
  if (Array.isArray(headers)) {
    headers = Object.fromEntries(headers as [string, string][])
  } else if (isHeaders(headers)) {
    headers = Object.fromEntries(headers.entries())
  }
  headers['accept-type'] = 'application/json'
  headers['content-type'] = 'application/json'
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

function isHeaders(input: object): input is Headers {
  return Reflect.get(input, Symbol.toStringTag) === 'Headers'
}
