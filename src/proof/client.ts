import { ProofError } from './errors'
import type {
  BindProofPayload,
  BindProofPayloadResponse,
  CreateProofModification,
  HealthResposne,
  Proof,
  QueryExistedBinding,
  QueryExistedBindingResponse,
  QueryProofBound,
  QueryProofChain,
  QueryProofChainResponse,
} from './types'

export class ProofClient {
  private readonly baseURL: URL
  private readonly fetch: typeof fetch

  static production(fetcher = fetch) {
    return new ProofClient('https://proof-service.next.id', fetcher)
  }

  static development(fetcher = fetch) {
    return new ProofClient('https://proof-service.nextnext.id', fetcher)
  }

  constructor(baseURL: string | URL, fetcher: typeof fetch) {
    this.baseURL = new URL(baseURL)
    this.fetch = fetcher
  }

  /**
   * General info
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L37
   */
  health<Platform extends string>() {
    return this.request<HealthResposne<Platform>>('healthz', {
      method: 'GET',
    })
  }

  /**
   * Create a proof modification
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L106
   */
  createProofModification<Location, Extra>(options: CreateProofModification<Location, Extra>) {
    return this.request<void>('v1/proof', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Query a proof payload to signature and to post
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L62
   */
  bindProof<BCP47Code extends string>(options: BindProofPayload) {
    return this.request<BindProofPayloadResponse<BCP47Code>>('v1/proof/payload', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Query an existed binding
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L154
   */
  queryExistedBinding(options: QueryExistedBinding) {
    return this.request<QueryExistedBindingResponse>('v1/proof', {
      method: 'GET',
      searchParams: {
        identity: options.identity.join(','),
        platform: options.platform,
        page: String(options.page ?? 1),
      },
    })
  }

  /** Iterator Existed Binding */
  async *iterExistedBinding(options: Omit<QueryExistedBinding, 'page'>) {
    let page = 1
    while (true) {
      const { pagination, ids } = await this.queryExistedBinding({ ...options, page })
      yield* ids
      if (pagination.next === 0) break
      page = pagination.next
    }
  }

  /**
   * Check if a proof exists
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L228
   */
  async queryBound(options: QueryProofBound): Promise<Proof> {
    return this.request<Proof>('v1/proof/exists', {
      method: 'GET',
      searchParams: {
        identity: options.identity,
        platform: options.platform,
        public_key: options.public_key,
      },
    })
  }

  /**
   * Get the proof chain items
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L270
   */
  queryProofChain(options: QueryProofChain) {
    return this.request<QueryProofChainResponse>('v1/proofchain', {
      method: 'GET',
      searchParams: {
        public_key: options.public_key,
        page: String(options.page ?? 1),
      },
    })
  }

  /** Iterator Proof Chain */
  async *iterProofChain(options: Omit<QueryProofChain, 'page'>) {
    let page = 1
    while (true) {
      const { pagination, proof_chain } = await this.queryProofChain({ ...options, page })
      yield* proof_chain
      if (pagination.next === 0) break
      page = pagination.next
    }
  }

  protected async request<T>(
    pathname: string,
    init?: RequestInit & { searchParams?: Record<string, string | undefined> },
  ) {
    const url = new URL(pathname, this.baseURL)
    const headers = new Headers(init?.headers ?? {})
    headers.set('accept-type', 'application/json')
    headers.set('content-type', 'application/json')
    for (const [key, value] of Object.entries(init?.searchParams ?? {})) {
      if (value === undefined) continue
      url.searchParams.set(key, value)
    }
    const response = await this.fetch(url.toString(), { ...init, headers })
    if (response.ok) return response.json() as Promise<T>
    interface ErrorResponse {
      message: string
    }
    const payload = (await response.json()) as ErrorResponse
    throw new ProofError(payload.message, response.status)
  }
}
