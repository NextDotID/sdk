/** Action (`create` / `delete`) */
export type Action = 'create' | 'delete'

export interface HealthResposne {
  /** must be `proof server` */
  readonly hello: string
  /** All `platform`s supported by this server */
  readonly platforms: readonly string[]
}

export interface CreateProofPayload<Extra> extends BindProofPayload {
  /** UUID of this chain link */
  readonly uuid: string
  /**  Creation time of this chain link (UNIX timestamp, unit: second) */
  readonly created_at: string
  /** Location where public-accessable proof post is set */
  readonly proof_location?: string
  /** Extra info for specific platform needed */
  readonly extra?: Extra
}

export interface ProofExtra {
  /** (needed for `platform: ethereum`) Signature signed by ETH wallet (w/ same sign payload), Base64Encoded */
  readonly wallet_signature?: string
  /** (needed for `platform: ethereum`) Signature signed by Persona private key (w/ same sign payload), Base64Encoded */
  readonly signature?: string
  readonly [name: string]: unknown
}

export interface QueryExistedBinding {
  /** Proof platform. If not given, all platforms will be searched */
  readonly platform?: string
  /** Identity on target platform */
  readonly identity: readonly string[]
  /** Pagination. First page is number `1` */
  readonly page?: number
}

export interface QueryExistedBindingResponse {
  /** Pagination info */
  readonly pagination: Pagination
  /** All IDs found. Will be empty array if not found. */
  readonly ids: readonly ProofIdentity[]
}

export interface QueryProofBound {
  /** Target platform */
  readonly platform: string
  /** Identity in target platform to proof */
  readonly identity: string
  /**
   * Public key of NextID Persona to connect to.
   * Should be SECP256K1 curve (for now),
   * 65-bytes or 33-bytes long (uncompressed / compressed) and
   * stringified into hex form (`/^0x[0-9a-f]{65,130}$/`).
   */
  readonly public_key: string
}

export interface BindProofPayload extends QueryProofBound {
  /** Action (`create` / `delete`) */
  readonly action: Action
}

export interface BindProofPayloadResponse {
  readonly post_content: unknown
  readonly sign_payload: string
  readonly uuid: string
  readonly created_at: string
}

export interface ProofIdentity {
  /** Persona public key */
  readonly persona: string
  /** All proofs under this persona */
  readonly proofs: readonly Proof[]
}

export interface QueryProofChain {
  readonly public_key: string
  /** Pagination. First page is number `1` */
  readonly page?: number
}

export interface QueryProofChainResponse<Extra> {
  /** Pagination info */
  readonly pagination: Pagination
  /** Proof Chain, Will be empty array if not found */
  readonly proof_chain: readonly ProofChain<Extra>[]
}

export interface ProofChain<Extra = unknown> {
  /** UUID of this chain link */
  readonly uuid: string
  /** Action (`create` / `delete`) */
  readonly action: Action
  /** Target platform */
  readonly platform: string
  /** Identity on that platform */
  readonly identity: string
  /** Location where public-accessable proof post is set */
  readonly proof_location: string
  /** Creation time of this proof. (timestamp, unit: second) */
  readonly created_at: string
  /** Generate `signature_payload` and `persona_private_key` */
  readonly signature: string
  /** Raw string to be sent to `personal_sign` */
  readonly signature_payload: string
  /** Extra info for specific platform needed. */
  readonly extra?: Extra
}

/** Pagination info */
export interface Pagination {
  /** Total amount of results */
  readonly total: number
  /** Per page size */
  readonly per: number
  /** Current page number */
  readonly current: number
  /** Next page. `0` if current page is the last one. */
  readonly next: number
}

export interface Proof {
  /** Platform */
  readonly platform: string
  /** Identity on that platform */
  readonly identity: string
  /** Creation time of this proof. (timestamp, unit: second) */
  readonly created_at: string
  /** When last validation happened. (timestamp, unit: second) */
  readonly last_checked_at: string
  /** This record is valid or not according to last validation */
  readonly is_valid: boolean
  /** If not valid, reason will appears here */
  readonly invalid_reason: string
}
