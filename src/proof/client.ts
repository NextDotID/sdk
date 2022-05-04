import { ProofError } from './errors'
import type {
  BindProofPayload,
  BindProofPayloadResponse,
  CreateProofPayload,
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

  constructor(baseURL: string | URL, fetcher: typeof fetch) {
    this.baseURL = new URL(baseURL)
    this.fetch = fetcher
  }

  /**
   * General info
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L37
   */
  health() {
    return this.request<HealthResposne>('healthz', {
      method: 'GET',
    })
  }

  /**
   * Create a proof modification
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L106
   */
  createPersonaPayload<Extra>(options: CreateProofPayload<Extra>) {
    return this.request<void>('v1/proof', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Query a proof payload to signature and to post
   * @link https://github.com/nextdotid/proof-server/blob/32bb5b/docs/api.apib#L62
   */
  bindProof(options: BindProofPayload) {
    return this.request<BindProofPayloadResponse>('v1/proof/payload', {
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
        page: options.page ?? 1,
      },
    })
  }

  /** Iterable Existed Binding */
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
   * @link https://github.com/nextdotid/proof-server/blob/HEAD/docs/api.apib#L154
   */
  async queryBound(options: QueryProofBound): Promise<Proof> {
    const proof = await this.request<Proof>('v1/proof/exists', {
      method: 'GET',
      searchParams: {
        identity: options.identity,
        platform: options.platform,
        public_key: options.public_key,
      },
    })
    return {
      ...proof,
      identity: options.identity,
      platform: options.platform,
    }
  }

  /**
   * Get the proof chain items
   * @link https://github.com/nextdotid/proof-server/blob/HEAD/docs/api.apib#L270
   */
  queryProofChain<Extra>(options: QueryProofChain) {
    return this.request<QueryProofChainResponse<Extra>>('v1/proofchain', {
      method: 'GET',
      searchParams: {
        public_key: options.public_key,
        page: options.page ?? 1,
      },
    })
  }

  /** Iterable Proof Chain */
  async *iterProofChain(options: Omit<QueryProofChain, 'page'>) {
    let page = 1
    while (true) {
      const { pagination, proof_chain } = await this.queryProofChain({ ...options, page })
      yield* proof_chain
      if (pagination.next === 0) break
      page = pagination.next
    }
  }

  protected async request<T>(pathname: string, init?: RequestInit & { searchParams?: object }) {
    const headers = new Headers(init?.headers ?? {})
    headers.set('accept-type', 'application/json')
    headers.set('content-type', 'application/json')
    const url = new URL(pathname, this.baseURL)
    Object.entries(init?.searchParams ?? {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
    const response = await this.fetch(url.toString(), { ...init, headers })
    if (!response.ok) {
      interface ErrorResponse {
        message: string
      }
      const payload = (await response.json()) as ErrorResponse
      throw new ProofError(payload.message, response.status)
    }
    return response.json() as Promise<T>
  }

  get [Symbol.toStringTag]() {
    return 'ProofClient'
  }
}
