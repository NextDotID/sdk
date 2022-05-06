import { KVError } from './errors'
import type { GetResposne, QueryPayload, QueryPayloadResponse, SetOptions } from './types'

export class KVClient {
  private readonly baseURL: URL
  private readonly fetch: typeof fetch

  static production(fetcher = fetch) {
    return new KVClient('https://kv-service.next.id', fetcher)
  }

  static development(fetcher = fetch) {
    return new KVClient('https://kv-service.nextnext.id', fetcher)
  }

  constructor(baseURL: string | URL, fetcher: typeof fetch) {
    this.baseURL = new URL(baseURL)
    this.fetch = fetcher
  }

  /**
   * Get current KV of a persona
   * @param persona Persona pubilc key (hexstring started with `0x`)
   * @link https://github.com/nextdotid/kv_server/blob/cb109b/docs/api.apib#L27
   */
  get(persona: string): Promise<GetResposne> {
    if (!persona.startsWith('0x')) return Promise.reject(new KVError('started with `0x`'))
    return this.request('v1/kv', {
      method: 'GET',
      searchParams: { persona },
    })
  }

  /**
   * Get signature payload for updating
   * @link https://github.com/nextdotid/kv_server/blob/cb109b/docs/api.apib#L74
   */
  getPayload<Patch>(options: QueryPayload<Patch>): Promise<QueryPayloadResponse> {
    return this.request('v1/kv/payload', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Update a full set of key-value pairs
   * @link https://github.com/nextdotid/kv_server/blob/cb109b/docs/api.apib#L121
   */
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
    if (response.ok) return response.json() as Promise<T>
    interface ErrorResponse {
      message: string
    }
    const payload = (await response.json()) as ErrorResponse
    throw new KVError(payload.message, response.status)
  }
}
