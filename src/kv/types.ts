export interface GetResposne {
  readonly persona: string
  readonly proofs: readonly Proof[]
}

export interface Proof {
  readonly platform: string
  readonly identity: string
  readonly content: Readonly<Record<string, unknown>>
}

export interface QueryPayload<Patch> {
  readonly persona: string
  readonly platform: string
  readonly identity: string
  readonly patch: Patch
}

export interface QueryPayloadResponse {
  readonly uuid: string
  readonly created_at: number
  readonly sign_payload: string
}

export interface SetOptions<Patch> {
  readonly persona: string
  readonly platform: string
  readonly identity: string
  readonly uuid: string
  readonly created_at: number
  readonly signature: string
  readonly patch: Patch
}
