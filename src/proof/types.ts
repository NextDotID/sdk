export type Action = 'create' | 'delete'

export interface HealthResposne {
  readonly hello: string
  readonly platforms: readonly string[]
}

export interface CreateProofPayload<Extra extends ProofExtra = ProofExtra> {
  readonly action: Action
  readonly platform: string
  readonly identity: string
  readonly public_key: string
  readonly proof_location?: string
  readonly extra?: Extra
  readonly uuid: string
  readonly created_at: string
}

export interface ProofExtra {
  readonly wallet_signature?: string
  readonly signature?: string
  readonly [name: string]: unknown
}

export interface QueryExistedBinding {
  readonly platform?: string
  readonly identity: readonly string[]
  readonly page?: number
}

export interface QueryExistedBindingResponse {
  readonly pagination: Pagination
  readonly ids: readonly ProofIdentity[]
}

export interface QueryProofBound {
  readonly platform: string
  readonly identity: string
  readonly public_key: string
}

export interface BindProofPayload extends QueryProofBound {
  readonly action: Action
}

export interface QueryProofPayloadResponse {
  readonly post_content: unknown
  readonly sign_payload: string
  readonly uuid: string
  readonly created_at: string
}

export interface ProofIdentity {
  readonly persona: string
  readonly proofs: readonly Proof[]
}

export interface QueryProofChain {
  readonly public_key: string
  readonly page?: number
}

export interface QueryProofChainResponse {
  readonly pagination: Pagination
  readonly proof_chain: readonly ProofChain[]
}

export interface ProofChain {
  readonly action: Action
  readonly platform: string
  readonly identity: string
  readonly proof_location: string
  readonly created_at: string
  readonly signature: string
  readonly signature_payload: string
  readonly extra?: ProofExtra
  readonly uuid: string
}

export interface Pagination {
  readonly total: number
  readonly per: number
  readonly current: number
  readonly next: number
}

export interface Proof {
  readonly platform: string
  readonly identity: string
  readonly created_at: string
  readonly last_checked_at: string
  readonly is_valid: string
  readonly invalid_reason: string
}
