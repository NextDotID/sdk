import { KVClient } from '../kv'
import { ProofClient } from '../proof'
import { ProofBinder, ProofBinderOptions } from './binder'
export { ProofBinder, type ProofBinderOptions }

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

  createBinder(options: ProofBinderOptions) {
    return new ProofBinder({
      proofClient: this.proofClient,
      kvClient: this.kvClient,
      ...options,
    })
  }
}
