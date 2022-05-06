import { ProofClient } from './client'
import { Action, CreateProofModification, EthereumProofExtra, QueryProofBound } from './types'

export interface ProofServiceOptions extends QueryProofBound {
  readonly client: ProofClient
}

export class ProofService<Extra = EthereumProofExtra> {
  readonly client: ProofClient
  readonly platform: string
  readonly identity: string
  readonly public_key: string

  constructor(options: ProofServiceOptions) {
    this.client = options.client
    this.platform = options.platform
    this.identity = options.identity
    this.public_key = options.public_key
  }

  health() {
    return this.client.health()
  }

  bindProof(action: Action) {
    return this.client.bindProof({
      platform: this.platform,
      identity: this.identity,
      public_key: this.public_key,
      action,
    })
  }

  createProofModification(options: Omit<CreateProofModification<Extra>, 'platform' | 'identity' | 'public_key'>) {
    return this.client.createProofModification({
      platform: this.platform,
      identity: this.identity,
      public_key: this.public_key,
      ...options,
    })
  }

  async deleteProof(options: SignatureOptions<Extra>) {
    const proof = await this.bindProof('delete')
    return this.createProofModification({
      action: 'delete',
      uuid: proof.uuid,
      created_at: proof.created_at,
      extra: await options.onSignature(proof.sign_payload),
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

interface SignatureOptions<Extra> {
  onSignature(payload: string): Extra | Promise<Extra>
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
