import { ProofClient } from './client'
import { Action, BaseInfo, CreateProofModification, EthereumProofExtra } from './types'

export interface ProofServiceOptions<Platform extends string> extends BaseInfo {
  readonly platform: Platform
  readonly client: ProofClient
}

export interface PlatformMap {
  nextid: never
  github: 'default'
  keybase: 'default'
  twitter: 'default' | 'en_US' | 'zh_CN'
  ethereum: never
}

export interface CreateProofVerification<BCP47Code extends string> {
  post_content: Record<BCP47Code, string>
  verify(location: string): Promise<void>
}

export interface EthereumProofExtraOptions {
  onExtra(payload: string): EthereumProofExtra | Promise<EthereumProofExtra>
}

export class ProofService<Platform extends keyof PlatformMap> {
  readonly client: ProofClient
  readonly platform: string
  readonly identity: string
  readonly public_key: string

  constructor(options: ProofServiceOptions<Platform>) {
    this.client = options.client
    this.platform = options.platform
    this.identity = options.identity
    this.public_key = options.public_key
  }

  health<Platform extends string = keyof PlatformMap>() {
    return this.client.health<Platform>()
  }

  bindProof(action: Action) {
    return this.client.bindProof<PlatformMap[Platform]>({
      platform: this.platform,
      identity: this.identity,
      public_key: this.public_key,
      action,
    })
  }

  createProofModification<Extra>(options: Omit<CreateProofModification<Extra>, keyof BaseInfo>) {
    return this.client.createProofModification({
      platform: this.platform,
      identity: this.identity,
      public_key: this.public_key,
      action: options.action,
      created_at: options.created_at,
      uuid: options.uuid,
      extra: options.extra,
      proof_location: options.proof_location,
    })
  }

  async createProof(
    options: Platform extends 'ethereum' ? EthereumProofExtraOptions : void,
  ): Promise<CreateProofVerification<PlatformMap[Platform]>> {
    const proof = await this.bindProof('create')
    return {
      post_content: proof.post_content,
      verify: async (proof_location?: string) => {
        return this.createProofModification({
          action: 'create',
          uuid: proof.uuid,
          created_at: proof.created_at,
          proof_location,
          extra: await options?.onExtra(proof.sign_payload),
        })
      },
    }
  }

  async deleteProof(options: Platform extends 'ethereum' ? EthereumProofExtraOptions : void) {
    const proof = await this.bindProof('delete')
    return this.createProofModification({
      action: 'delete',
      uuid: proof.uuid,
      created_at: proof.created_at,
      extra: await options?.onExtra(proof.sign_payload),
    })
  }

  queryBound() {
    return this.client.queryBound({
      platform: this.platform,
      identity: this.identity,
      public_key: this.public_key,
    })
  }

  // #region existed binding
  iterExistedBinding() {
    return this.client.iterExistedBinding({
      platform: this.platform,
      identity: [this.identity],
    })
  }

  allExistedBinding() {
    return toArray(this.iterExistedBinding())
  }
  // #endregion

  // #region proof chain
  iterProofChain() {
    return this.client.iterProofChain({
      public_key: this.public_key,
    })
  }

  allProofChain() {
    return toArray(this.iterProofChain())
  }
  // #endregion
}

async function toArray<T>(iterate: AsyncGenerator<T>): Promise<readonly T[]> {
  const elements: T[] = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await iterate.next()
    if (result.done) break
    elements.push(result.value)
  }
  return elements
}
