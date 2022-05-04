import { KVClient } from '../kv'
import { ProofClient } from '../proof'
import { BindProofPayload, CreateProofPayload, ProofExtra } from '../proof/types'
import { ProofBinder } from './binder'

export interface NextIDServiceOptions {
  proofBaseURL: string | URL
  kvBaseURL: string | URL
  fetch: typeof fetch
}

export class NextIDService {
  public readonly proofClient: ProofClient
  public readonly kvClient: KVClient

  static production(fetcher = fetch) {
    return new NextIDService({
      proofBaseURL: 'https://proof-service.next.id',
      kvBaseURL: 'https://kv-service.next.id',
      fetch: fetcher,
    })
  }

  static development(fetcher = fetch) {
    return new NextIDService({
      proofBaseURL: 'https://proof-service.nextnext.id',
      kvBaseURL: 'https://kv-service.nextnext.id',
      fetch: fetcher,
    })
  }

  constructor(options: NextIDServiceOptions) {
    const fetcher = options?.fetch
    this.proofClient = new ProofClient(options.proofBaseURL, fetcher)
    this.kvClient = new KVClient(options.kvBaseURL, fetcher)
  }

  async getAvaiabilePlatformList() {
    const { platforms } = await this.proofClient.health()
    return Object.freeze(platforms)
  }

  async bindProof(options: BindProofPayload) {
    return this.proofClient.bindProof(options)
  }

  async createBinder<Extra = ProofExtra>(options: CreateProofPayload<Extra>) {
    await this.proofClient.createPersonaPayload<Extra>(options)
    return new ProofBinder({
      proofClient: this.proofClient,
      kvClient: this.kvClient,
      ...options,
    })
  }

  get [Symbol.toStringTag]() {
    return 'NextIDService'
  }
}
