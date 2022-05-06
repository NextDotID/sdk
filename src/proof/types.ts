/** Action (`create` / `delete`) */
export type Action = 'create' | 'delete'

export interface BaseInfo {
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

export interface HealthResposne<Platform extends string> {
  /** must be `proof server` */
  readonly hello: string
  /** All `platform`s supported by this server */
  readonly platforms: readonly Platform[]
}

export interface CreateProofModification<Location, Extra> extends BindProofPayload {
  /** UUID of this chain link */
  readonly uuid: string
  /**  Creation time of this chain link (UNIX timestamp, unit: second) */
  readonly created_at: string
  /** Location where public-accessable proof post is set */
  readonly proof_location: Location
  /** Extra info for specific platform needed */
  readonly extra: Extra
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

export type QueryProofBound = BaseInfo

export interface BindProofPayload extends QueryProofBound {
  /** Action (`create` / `delete`) */
  readonly action: Action
}

export interface BindProofPayloadResponse<BCP47Code extends string> {
  /** UUID of this chain link */
  readonly uuid: string
  /** Creation time of this chain link (UNIX timestamp, unit: second) */
  readonly created_at: string
  /**
   * Post (in different languages) to let user send / save to target platform.
   * Placeholders should be replaced by frontend / client.
   * Language code follows BCP-47 standard (i.e. https://www.rfc-editor.org/info/bcp47).
   * Note: there is always a `default` content.
   */
  readonly post_content: BCP47Code extends string ? Readonly<Record<BCP47Code, string>> : never
  /** Needed signing payload */
  readonly sign_payload: string
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

export interface QueryProofChainResponse {
  /** Pagination info */
  readonly pagination: Pagination
  /** Proof Chain, Will be empty array if not found */
  readonly proof_chain: readonly ProofChain[]
}

export interface ProofChain<Extra = unknown> extends Omit<BaseInfo, 'public_key'> {
  /** UUID of this chain link */
  readonly uuid: string
  /** Action (`create` / `delete`) */
  readonly action: Action
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

export interface Proof extends Omit<BaseInfo, 'public_key'> {
  /** Creation time of this proof. (timestamp, unit: second) */
  readonly created_at: string
  /** When last validation happened. (timestamp, unit: second) */
  readonly last_checked_at: string
  /** This record is valid or not according to last validation */
  readonly is_valid: boolean
  /** If not valid, reason will appears here */
  readonly invalid_reason: string
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
