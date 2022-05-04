import { KVError } from './errors'
import type { GetResposne, QueryPayload, QueryPayloadResponse, SetOptions } from './types'

export class KVClient {
  private readonly baseURL: URL
  private readonly fetch: typeof fetch

  constructor(baseURL: string | URL, fetcher: typeof fetch) {
    this.baseURL = new URL(baseURL)
    this.fetch = fetcher
  }

  get(persona: string): Promise<GetResposne> {
    return this.request('v1/kv', {
      method: 'GET',
      searchParams: { persona },
    })
  }

  getPayload<Patch>(options: QueryPayload<Patch>): Promise<QueryPayloadResponse> {
    return this.request('v1/kv/payload', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  set<Patch>(options: SetOptions<Patch>) {
    return this.request<void>('v1/kv', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  protected async request<T>(pathname: string, init?: RequestInit & { searchParams?: object }) {
    const url = new URL(pathname, this.baseURL)
    Object.entries(init?.searchParams ?? {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
    const response = await this.fetch(url.toString(), init)
    if (!response.ok) throw new KVError(response.statusText, response.status)
    return response.json() as Promise<T>
  }

  get [Symbol.toStringTag]() {
    return 'KVClient'
  }
}
