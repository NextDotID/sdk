import { ProofClient } from './client'
import type {
  CreateProofModificationType,
  CreateProofVerification,
  ExtraSpecificOptions,
  PlatformMap,
  ProofServiceOptions,
} from './service.types'
import type { Action } from './types'

export class ProofService<Platform extends keyof PlatformMap> {
  readonly client: ProofClient
  readonly platform: Platform
  readonly identity: string
  readonly publicKey: string

  constructor(options: ProofServiceOptions<Platform>) {
    this.client = options.client
    this.platform = options.platform
    this.identity = options.identity
    this.publicKey = options.public_key
  }

  health<Platform extends string = keyof PlatformMap>() {
    return this.client.health<Platform>()
  }

  bindProof(action: Action) {
    return this.client.bindProof<PlatformMap[Platform]>({
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
      action,
    })
  }

  createProofModification(options: CreateProofModificationType<Platform>) {
    return this.client.createProofModification({
      action: options.action,
      uuid: options.uuid,
      created_at: options.created_at,
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
      proof_location: options.proof_location,
      extra: options.extra,
    })
  }

  async createProof(options: ExtraSpecificOptions<Platform>) {
    const proof = await this.client.bindProof<PlatformMap[Platform]>({
      action: 'create',
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
    })
    const verification: CreateProofVerification<PlatformMap[Platform]> = {
      post_content: proof.post_content,
      verify: async (proof_location?: string) => {
        return this.client.createProofModification({
          action: 'create',
          uuid: proof.uuid,
          created_at: proof.created_at,
          platform: this.platform,
          identity: this.identity,
          public_key: this.publicKey,
          proof_location,
          extra: await options?.onExtra(proof.sign_payload),
        })
      },
    }
    return verification
  }

  async deleteProof(options: ExtraSpecificOptions<Platform>) {
    const proof = await this.client.bindProof({
      action: 'delete',
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
    })
    return this.client.createProofModification({
      action: 'delete',
      uuid: proof.uuid,
      created_at: proof.created_at,
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
      proof_location: undefined as never,
      extra: await options?.onExtra(proof.sign_payload),
    })
  }

  queryBound() {
    return this.client.queryBound({
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
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
      public_key: this.publicKey,
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
