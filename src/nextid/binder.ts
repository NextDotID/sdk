import { KVClient } from '../kv'
import { ProofClient } from '../proof'
import { Action, ProofChain, ProofExtra, ProofIdentity } from '../proof/types'

export interface ProofBinderOptions {
  platform: string
  identity: string
  public_key: string
}

export interface CreateProofPayload {
  readonly uuid: string
  readonly created_at: string
  readonly proof_location?: string
  readonly extra?: ProofExtra
}

export class ProofBinder {
  private readonly proofClient: ProofClient
  private readonly kvClient: KVClient
  private readonly platform: string
  private readonly identity: string
  private readonly publicKey: string

  constructor(options: ProofBinderOptions & { proofClient: ProofClient; kvClient: KVClient }) {
    this.proofClient = options.proofClient
    this.kvClient = options.kvClient
    this.platform = options.platform
    this.identity = options.identity
    this.publicKey = options.public_key
  }

  get() {
    return this.kvClient.get(this.publicKey)
  }

  getPayload<Patch>(patch: Patch) {
    return this.kvClient.getPayload({
      platform: this.platform,
      identity: this.identity,
      persona: this.publicKey,
      patch,
    })
  }

  set<Patch>(options: SetOptions<Patch>) {
    return this.kvClient.set({
      platform: this.platform,
      identity: this.identity,
      persona: this.publicKey,
      ...options,
    })
  }

  createPersonaPayload(action: Action, options: CreateProofPayload) {
    return this.proofClient.createPersonaPayload({
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
      action,
      ...options,
    })
  }

  bindProof(action: Action) {
    return this.proofClient.bindProof({
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
      action,
    })
  }

  queryExistedBinding(page = 1) {
    return this.proofClient.queryExistedBinding({
      platform: this.platform,
      identity: [this.identity],
      page,
    })
  }

  iterExistedBinding() {
    return this.proofClient.iterExistedBinding({
      platform: this.platform,
      identity: [this.identity],
    })
  }

  async allExistedBinding() {
    const proofs: ProofIdentity[] = []
    for await (const proof of this.iterExistedBinding()) {
      proofs.push(proof)
    }
    return proofs
  }

  queryBound() {
    return this.proofClient.queryBound({
      platform: this.platform,
      identity: this.identity,
      public_key: this.publicKey,
    })
  }

  queryProofChain(page = 1) {
    return this.proofClient.queryProofChain({
      public_key: this.publicKey,
      page,
    })
  }

  iterProofChain() {
    return this.proofClient.iterProofChain({
      public_key: this.publicKey,
    })
  }

  async allProofChain() {
    const proofs: ProofChain[] = []
    for await (const proof of this.iterProofChain()) {
      proofs.push(proof)
    }
    return proofs
  }
}

export interface SetOptions<Patch> {
  readonly uuid: string
  readonly created_at: number
  readonly signature: string
  readonly patch: Patch
}
