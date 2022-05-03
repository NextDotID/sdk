import { NextIDService } from './index'

async function main() {
  const service = NextIDService.development()
  const payload = await service.bindProof({
    action: 'create',
    platform: 'twitter',
    identity: 'twitter_user_handle',
    public_key: 'persona_hex_key',
  })
  const binder = await service.createBinder({
    uuid: 'uuid',
    public_key: 'persona hex key',
    action: 'create',
    platform: 'twitter',
    identity: 'twitter_user_handle',
    created_at: 'created_at',
    extra: {
      signature: 'signature',
      proofLocation: 'twitter post id',
    },
  })
  for await (const { persona, proofs } of binder.iterExistedBinding()) {
    persona
    proofs
  }
}
