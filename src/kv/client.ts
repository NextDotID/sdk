import { buildHeaders, buildURL } from '../utils'
import { KVError } from './errors'
import type { GetResposne, HealthResposne, QueryPayload, QueryPayloadResponse, SetOptions } from './types'

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
   * General info
   */
  health() {
    return this.request<HealthResposne>('healthz', {
      method: 'GET',
    })
  }

  /**
   * Get current KV of an avatar
   * @param avatar Avatar public key (hex-string started with `0x`)
   * @link https://github.com/nextdotid/kv_server/blob/cb109b/docs/api.apib#L27
   */
  get(avatar: string): Promise<GetResposne> {
    if (!avatar.startsWith('0x')) return Promise.reject(new KVError('started with `0x`', 400))
    return this.request('v1/kv', {
      method: 'GET',
      searchParams: { avatar },
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

  protected async request<T>(pathname: string, init?: RequestInitModified) {
    const response = await this.fetch(buildURL(pathname, this.baseURL, init?.searchParams), {
      ...init,
      headers: buildHeaders(init?.headers),
    })
    if (!response.ok) throw KVError.from(response)
    return response.json() as Promise<T>
  }
}

interface RequestInitModified extends RequestInit {
  searchParams?: Record<string, string | undefined>
}
