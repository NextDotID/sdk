# Next.ID Service

The is {Key-Value,Proof} Client high-level API

## Usage

```ts
import { NextIDService } from '@nextdotid/sdk'

// preset `production` and `development` named constructor
const service = NextIDService.development() // = NextIDService.production()
// get available platform list
const platforms = await service.getAvaiabilePlatformList()
// get a binder instance, the binder pre-fill `platform`, `identity` and `public_key` on api call
const binder = service.createBinder({
  platform: 'platform code',
  identity: 'identity',
  public_key: 'your public key',
})
```
