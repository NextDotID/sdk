import { KVClient } from './client'
import { BaseInfo, SetOptions } from './types'

export interface KVServiceOptions extends BaseInfo {
  readonly client: KVClient
}

export class KVService {
  public readonly client: KVClient
  public readonly persona: string
  public readonly platform: string
  public readonly identity: string

  constructor(options: KVServiceOptions) {
    this.client = options.client
    this.persona = options.persona
    this.platform = options.platform
    this.identity = options.identity
  }

  get() {
    return this.client.get(this.persona)
  }

  getPayload<Patch>(patch: Patch) {
    return this.client.getPayload<Patch>({
      persona: this.persona,
      platform: this.platform,
      identity: this.identity,
      patch,
    })
  }

  set<Patch>(options: Omit<SetOptions<Patch>, keyof BaseInfo>) {
    return this.client.set({
      persona: this.persona,
      platform: this.platform,
      identity: this.identity,
      ...options,
    })
  }
}
