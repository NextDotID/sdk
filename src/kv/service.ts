import { PlatformMap } from '../proof'
import { KVClient } from './client'
import { BaseInfo } from './types'

export interface KVServiceOptions<Platform extends string> extends BaseInfo {
  readonly platform: Platform
  readonly client: KVClient
}

export class KVService<Platform extends string = keyof PlatformMap> {
  public readonly client: KVClient
  public readonly persona: string
  public readonly platform: Platform
  public readonly identity: string

  constructor(options: KVServiceOptions<Platform>) {
    this.client = options.client
    this.persona = options.persona
    this.platform = options.platform
    this.identity = options.identity
  }

  health() {
    return this.client.health()
  }

  get() {
    return this.client.get(this.persona)
  }

  async set<Patch>(patch: Patch, options: SignatureOptions) {
    const payload = await this.client.getPayload<Patch>({
      persona: this.persona,
      platform: this.platform,
      identity: this.identity,
      patch,
    })
    return this.client.set<Patch>({
      persona: this.persona,
      platform: this.platform,
      identity: this.identity,
      uuid: payload.uuid,
      created_at: payload.created_at,
      signature: await options.onSignature(payload.sign_payload),
      patch,
    })
  }
}

interface SignatureOptions {
  onSignature(payload: string): string | Promise<string>
}
