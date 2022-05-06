import { ProofClient } from './client'
import { BaseInfo, CreateProofModification } from './types'

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
  readonly post_content: BCP47Code extends string ? Readonly<Record<BCP47Code, string>> : never
  verify(location: BCP47Code extends string ? string : never): Promise<void>
}

export interface ExtraOptions<T> {
  onExtra(payload: string): T | Promise<T>
}

export type ProofLocation<Platform extends keyof PlatformMap> = PlatformMap[Platform] extends string ? string : never

export type ProofExtra<Platform extends keyof PlatformMap> = Platform extends 'ethereum' ? EthereumProofExtra : never

export type CreateProofModificationType<Platform extends keyof PlatformMap> = Omit<
  CreateProofModification<ProofLocation<Platform>, ProofExtra<Platform>>,
  keyof BaseInfo
>

export type ExtraSpecificOptions<Platform extends keyof PlatformMap> = ProofExtra<Platform> extends never
  ? never
  : ExtraOptions<ProofExtra<Platform>>

export interface EthereumProofExtra {
  /** Signature signed by ETH wallet (w/ same sign payload), Base64Encoded */
  readonly wallet_signature: string
  /** Signature signed by Persona private key (w/ same sign payload), Base64Encoded */
  readonly signature: string
}
