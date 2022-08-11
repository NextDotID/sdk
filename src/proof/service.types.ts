import { ProofClient } from './client'
import { BaseInfo } from './types'

export interface PlatformMap {
  nextid: never
  github: 'default'
  keybase: 'default'
  twitter: 'default' | 'en_US' | 'zh_CN'
  discord: 'default' | 'en-US' | 'zh-CN'
  ethereum: never
}

export interface ProofServiceOptions<Platform extends keyof PlatformMap> extends BaseInfo {
  readonly platform: Platform
  readonly client: ProofClient
}

export interface CreateProofVerification<Platform extends keyof PlatformMap> {
  readonly post_content: PlatformMap[Platform] extends never ? never : Readonly<Record<PlatformMap[Platform], string>>
  verify(proof_location: PlatformMap[Platform] extends never ? void : string): Promise<void>
}

export interface ExtraOptions<T> {
  onExtra(payload: string): T | Promise<T>
}

export type ProofLocation<Platform extends keyof PlatformMap> = PlatformMap[Platform] extends string ? string : never

export type ProofExtra<Platform extends keyof PlatformMap> = Platform extends 'ethereum' ? EthereumProofExtra : never

export type ExtraSpecificOptions<Platform extends keyof PlatformMap> = ProofExtra<Platform> extends never
  ? void
  : ExtraOptions<ProofExtra<Platform>>

export interface EthereumProofExtra {
  /** Signature signed by ETH wallet (w/ same sign payload), Base64Encoded */
  readonly wallet_signature: string
  /** Signature signed by Avatar private key (w/ same sign payload), Base64Encoded */
  readonly signature: string
}
