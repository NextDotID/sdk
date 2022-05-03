import { KVClient } from '../kv'
import { ProofClient } from '../proof'
import { BindProofPayload, CreateProofPayload, ProofExtra } from '../proof/types'
import { ProofBinder } from './binder'
export { ProofBinder }

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
      kvBaseURL: 'https://kv-service.next.id',
      proofBaseURL: 'https://proof-service.next.id',
      fetch: fetcher,
    })
  }

  static development(fetcher = fetch) {
    return new NextIDService({
      kvBaseURL: 'https://kv-service.nextnext.id',
      proofBaseURL: 'https://proof-service.nextsnext.id',
      fetch: fetcher,
    })
  }

  constructor(options: NextIDServiceOptions) {
    const fetcher = options?.fetch
    this.proofClient = new ProofClient(options.proofBaseURL, fetcher)
    this.kvClient = new KVClient(options.kvBaseURL, fetcher)
  }

  async getAvaiabilePlatformList(): Promise<readonly string[]> {
    const { platforms } = await this.proofClient.health()
    return platforms
  }

  async bindProof(options: BindProofPayload) {
    return this.proofClient.bindProof(options)
  }

  async createBinder<Extra extends ProofExtra>(options: CreateProofPayload<Extra>) {
    await this.proofClient.createPersonaPayload(options)
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
