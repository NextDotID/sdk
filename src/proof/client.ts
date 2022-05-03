import { ProofError } from './errors'
import type {
  CreateProofPayload,
  HealthResposne,
  Proof,
  QueryExistedBinding,
  QueryExistedBindingResponse,
  QueryProofBound,
  QueryProofChain,
  QueryProofChainResponse,
  BindProofPayload,
  QueryProofPayloadResponse,
} from './types'

export class ProofClient {
  private readonly baseURL: URL
  private readonly fetch: typeof fetch

  constructor(baseURL: string | URL, fetcher: typeof fetch) {
    this.baseURL = new URL(baseURL)
    this.fetch = fetcher
  }

  health() {
    return this.request<HealthResposne>('healthz', {
      method: 'GET',
    })
  }

  createPersonaPayload(options: CreateProofPayload) {
    return this.request<void>('v1/proof', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  bindProof(options: BindProofPayload) {
    return this.request<QueryProofPayloadResponse>('v1/proof/payload', {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

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

  async *iterExistedBinding(options: Omit<QueryExistedBinding, 'page'>) {
    let page = 1
    while (true) {
      const { pagination, ids } = await this.queryExistedBinding({ ...options, page })
      yield* ids
      if (pagination.next === pagination.current) break
      page = pagination.next
    }
  }

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

  queryProofChain(options: QueryProofChain) {
    return this.request<QueryProofChainResponse>('v1/proofchain', {
      method: 'GET',
      searchParams: {
        public_key: options.public_key,
        page: options.page ?? 1,
      },
    })
  }

  async *iterProofChain(options: Omit<QueryProofChain, 'page'>) {
    let page = 1
    while (true) {
      const { pagination, proof_chain } = await this.queryProofChain({ ...options, page })
      yield* proof_chain
      if (pagination.next === pagination.current) break
      page = pagination.next
    }
  }

  protected async request<T>(pathname: string, init?: RequestInit & { searchParams?: object }): Promise<T> {
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
      const payload: { message: string } = await response.json()
      throw new ProofError(payload.message, response.status)
    }
    return response.json()
  }

  get [Symbol.toStringTag]() {
    return 'ProofClient'
  }
}
